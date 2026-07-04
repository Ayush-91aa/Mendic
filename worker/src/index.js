import { Webhook } from 'svix';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health Check Endpoint
    if (url.pathname === '/' || url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'mendic-api worker' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clerk Webhook Receiver Route
    if (url.pathname === '/api/webhooks/clerk' && request.method === 'POST') {
      // 1. Extract Svix headers for signature verification
      const svix_id = request.headers.get('svix-id');
      const svix_timestamp = request.headers.get('svix-timestamp');
      const svix_signature = request.headers.get('svix-signature');

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response(JSON.stringify({ error: 'Missing required Svix headers' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. Ensure CLERK_WEBHOOK_SECRET is configured in environment
      if (!env.CLERK_WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ error: 'CLERK_WEBHOOK_SECRET is not configured on the server' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. Get raw request body string (required by Svix for exact HMAC computation)
      const payloadString = await request.text();

      // 4. Verify webhook signature using Svix library
      const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
      let evt;

      try {
        evt = wh.verify(payloadString, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        });
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 5. Database Sync Logic for user.created
      const eventType = evt.type;

      if (eventType === 'user.created') {
        const { id, email_addresses, primary_email_address_id } = evt.data;

        // Extract primary email address
        let primaryEmail = null;
        if (Array.isArray(email_addresses) && email_addresses.length > 0) {
          const found = email_addresses.find((e) => e.id === primary_email_address_id);
          primaryEmail = found ? found.email_address : email_addresses[0].email_address;
        }

        if (!id || !primaryEmail) {
          return new Response(JSON.stringify({ error: 'Payload missing user ID or primary email address' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        try {
          // Insert new user into Cloudflare D1 users table
          // ON CONFLICT handles duplicate webhook delivery attempts gracefully
          await env.DB.prepare(
            `INSERT INTO users (id, email, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(id) DO UPDATE SET email = excluded.email`
          )
            .bind(id, primaryEmail)
            .run();

          console.log(`[Sync Success] User ${id} (${primaryEmail}) synced to D1 database.`);

          return new Response(
            JSON.stringify({
              success: true,
              message: `User ${id} synced to D1 database successfully`,
              user: { id, email: primaryEmail },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        } catch (dbErr) {
          console.error('D1 Database insertion error:', dbErr.message);
          return new Response(JSON.stringify({ error: 'Database sync failed', details: dbErr.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      // Acknowledge other verified webhook event types without error
      return new Response(
        JSON.stringify({ success: true, message: `Webhook event (${eventType}) received and ignored.` }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 404 for unmatched paths
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
