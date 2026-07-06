import { Webhook } from 'svix';
import { authenticateRequest } from './auth.js';

const ADMIN_EMAILS = [
  'mendicindia@gmail.com',
  'divyaprakashsinghchauhan1234@gmail.com',
  'dpsc90071@gmail.com',
  'modulusfunctio9@gmail.com'
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-timestamp, svix-signature',
};

const DEFAULT_ALLOWED_ORIGINS = [
  'https://mendic-web.pages.dev',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

export function getCorsHeaders(request, env) {
  const origin = request?.headers?.get('Origin');
  let allowedOrigins = [...DEFAULT_ALLOWED_ORIGINS];
  
  if (env && env.ALLOWED_ORIGINS) {
    const envOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);
    allowedOrigins = [...allowedOrigins, ...envOrigins];
  }

  const allowedOrigin = (origin && allowedOrigins.includes(origin)) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-timestamp, svix-signature',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health Check Endpoint
    if (url.pathname === '/' || url.pathname === '/api/health') {
      return jsonResponse({ status: 'ok', service: 'mendic-api marketplace worker' });
    }

    // ---------------------------------------------------------
    // 1. Clerk Webhook Receiver Route
    // ---------------------------------------------------------
    if (url.pathname === '/api/webhooks/clerk' && request.method === 'POST') {
      const svix_id = request.headers.get('svix-id');
      const svix_timestamp = request.headers.get('svix-timestamp');
      const svix_signature = request.headers.get('svix-signature');

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return jsonResponse({ error: 'Missing required Svix headers' }, 400);
      }
      if (!env.CLERK_WEBHOOK_SECRET) {
        return jsonResponse({ error: 'CLERK_WEBHOOK_SECRET is not configured' }, 500);
      }

      // Clean secret (remove whitespace, newlines, quotes, or accidental prefixes from terminal paste)
      let secret = env.CLERK_WEBHOOK_SECRET.trim().replace(/['"]/g, '').replace(/\s+/g, '');
      const whsecIndex = secret.indexOf('whsec_');
      if (whsecIndex !== -1) {
        secret = secret.substring(whsecIndex);
      }

      const payloadString = await request.text();
      let wh;
      try {
        wh = new Webhook(secret);
      } catch (err) {
        console.error('Failed to initialize Svix Webhook with provided secret:', err.message);
        return jsonResponse({ error: 'Invalid CLERK_WEBHOOK_SECRET format on server', details: err.message }, 500);
      }

      let evt;
      try {
        evt = wh.verify(payloadString, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        });
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return jsonResponse({ error: 'Invalid webhook signature' }, 400);
      }

      if (evt.type === 'user.created') {
        const { id, email_addresses, primary_email_address_id } = evt.data;
        let primaryEmail = null;
        if (Array.isArray(email_addresses) && email_addresses.length > 0) {
          const found = email_addresses.find((e) => e.id === primary_email_address_id);
          primaryEmail = found ? found.email_address : email_addresses[0].email_address;
        }
        if (!primaryEmail) primaryEmail = `test_${id}@clerk.mock`;

        const role = ADMIN_EMAILS.includes(primaryEmail.toLowerCase()) ? 'admin' : 'customer';

        try {
          await env.DB.prepare("DELETE FROM users WHERE email = ? AND id != ?").bind(primaryEmail, id).run();
          await env.DB.prepare(
            `INSERT INTO users (id, email, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(id) DO UPDATE SET email = excluded.email, role = excluded.role`
          ).bind(id, primaryEmail, role).run();

          if (role === 'admin' && env.CLERK_SECRET_KEY) {
            await fetch(`https://api.clerk.com/v1/users/${id}/metadata`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ public_metadata: { role: 'admin' } })
            }).catch(e => console.error('Failed to set admin role in Clerk:', e));
          }

          return jsonResponse({ success: true, message: `User ${id} synced to D1 as ${role}`, user: { id, email: primaryEmail, role } });
        } catch (dbErr) {
          return jsonResponse({ error: 'Database sync failed', details: dbErr.message }, 500);
        }
      }

      return jsonResponse({ success: true, message: `Webhook event (${evt.type}) received and ignored.` });
    }

    // ---------------------------------------------------------
    // 2. User & Auth Profile Routes
    // ---------------------------------------------------------
    if (url.pathname.startsWith('/api/user/') && request.method === 'GET') {
      const session = await authenticateRequest(request, env);
      const userId = url.pathname.split('/')[3];
      if (!session) return jsonResponse({ error: 'Unauthorized: Authentication required' }, 401);
      if (session.userId !== userId && session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Cannot access another user profile' }, 403);

      const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      if (!user) {
        return jsonResponse({ error: 'User not found' }, 404);
      }
      return jsonResponse({ success: true, user });
    }

    // ---------------------------------------------------------
    // 3. Mechanic Onboarding & Verification Routes
    // ---------------------------------------------------------
    if (url.pathname === '/api/mechanics/apply' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { userId, fullName, phone, city, address, experienceYears = 1, specializations = '' } = body;
        const location = city || address || 'Bangalore';

        if (!userId || !fullName || !phone) {
          return jsonResponse({ error: 'Missing required fields' }, 400);
        }

        const mechId = 'MECH-' + Math.floor(1000 + Math.random() * 9000);
        await env.DB.prepare(
          `INSERT INTO mechanics (id, user_id, full_name, phone, city, experience_years, specializations, verification_status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
           ON CONFLICT(user_id) DO UPDATE SET full_name = excluded.full_name, phone = excluded.phone, city = excluded.city, experience_years = excluded.experience_years, specializations = excluded.specializations`
        ).bind(mechId, userId, fullName, phone, location, experienceYears, specializations).run();

        await env.DB.prepare("UPDATE users SET role = 'mechanic' WHERE id = ?").bind(userId).run();
        if (env.CLERK_SECRET_KEY) {
          await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              public_metadata: {
                role: 'mechanic',
                verification_status: 'pending'
              }
            })
          }).catch(e => console.error('Failed to sync Clerk metadata:', e));
        }

        return jsonResponse({ success: true, message: 'Application submitted successfully. Pending Admin verification.', mechanicId: mechId });
      } catch (err) {
        return jsonResponse({ error: 'Failed to submit application', details: err.message }, 500);
      }
    }

    // Admin: Get all mechanics
    if (url.pathname === '/api/admin/mechanics' && request.method === 'GET') {
      const session = await authenticateRequest(request, env);
      if (!session || session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Admin privileges required' }, 403);

      const { results } = await env.DB.prepare('SELECT * FROM mechanics ORDER BY created_at DESC').all();
      return jsonResponse({ success: true, mechanics: results || [] });
    }

    // Admin: Verify Mechanic
    if (url.pathname.startsWith('/api/admin/mechanics/') && url.pathname.endsWith('/verify') && request.method === 'PATCH') {
      const session = await authenticateRequest(request, env);
      if (!session || session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Admin privileges required' }, 403);

      const mechId = url.pathname.split('/')[4];
      try {
        const mech = await env.DB.prepare('SELECT * FROM mechanics WHERE id = ?').bind(mechId).first();
        if (!mech) return jsonResponse({ error: 'Mechanic not found' }, 404);

        await env.DB.prepare("UPDATE mechanics SET verification_status = 'verified' WHERE id = ?").bind(mechId).run();
        if (mech.user_id) {
          await env.DB.prepare("UPDATE users SET role = 'mechanic' WHERE id = ?").bind(mech.user_id).run();
          if (env.CLERK_SECRET_KEY) {
            await fetch(`https://api.clerk.com/v1/users/${mech.user_id}/metadata`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                public_metadata: {
                  role: 'mechanic',
                  verification_status: 'verified'
                }
              })
            }).catch(e => console.error('Failed to sync Clerk metadata:', e));
          }
        }

        return jsonResponse({ success: true, message: `Mechanic ${mech.full_name} verified successfully!` });
      } catch (err) {
        return jsonResponse({ error: 'Verification failed', details: err.message }, 500);
      }
    }

    // ---------------------------------------------------------
    // 4. Customer Order & Marketplace Routes
    // ---------------------------------------------------------
    if (url.pathname === '/api/orders' && request.method === 'POST') {
      try {
        const body = await request.json();
        const {
          customerId, customerName, customerPhone, customerEmail, address,
          deviceType = 'laptop', brand, model, issueDescription, estimatedPrice = 0, timeSlot = 'As soon as possible'
        } = body;

        if (!customerName || !customerPhone || !address || !model) {
          return jsonResponse({ error: 'Missing required order details' }, 400);
        }

        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
        await env.DB.prepare(
          `INSERT INTO orders (id, customer_id, customer_name, customer_phone, customer_email, address, device_type, brand, model, issue_description, estimated_price, time_slot, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'searching_mechanic', CURRENT_TIMESTAMP)`
        ).bind(orderId, customerId || null, customerName, customerPhone, customerEmail || null, address, deviceType, brand, model, issueDescription, estimatedPrice, timeSlot).run();

        return jsonResponse({ success: true, message: 'Order created successfully!', orderId, status: 'searching_mechanic' });
      } catch (err) {
        return jsonResponse({ error: 'Failed to create order', details: err.message }, 500);
      }
    }

    // Get orders for customer
    if (url.pathname.startsWith('/api/orders/user/') && request.method === 'GET') {
      const session = await authenticateRequest(request, env);
      const customerId = url.pathname.split('/')[4];
      if (!session) return jsonResponse({ error: 'Unauthorized: Authentication required' }, 401);
      if (session.userId !== customerId && session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Cannot access another user orders' }, 403);

      const { results } = await env.DB.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').bind(customerId).all();
      return jsonResponse({ success: true, orders: results || [] });
    }

    // Admin: Get all orders
    if (url.pathname === '/api/admin/orders' && request.method === 'GET') {
      const session = await authenticateRequest(request, env);
      if (!session || session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Admin privileges required' }, 403);

      const { results } = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
      return jsonResponse({ success: true, orders: results || [] });
    }

    // Verified Mechanic Feed: Get open orders
    if (url.pathname === '/api/mechanic/feed' && request.method === 'GET') {
      const session = await authenticateRequest(request, env);
      const userId = url.searchParams.get('userId');
      if (!userId) {
        return jsonResponse({ error: 'Missing userId parameter' }, 400);
      }
      if (!session) return jsonResponse({ error: 'Unauthorized: Authentication required' }, 401);
      if (session.userId !== userId && session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Cannot access another mechanic feed' }, 403);

      const mech = await env.DB.prepare("SELECT * FROM mechanics WHERE user_id = ?").bind(userId).first();
      if (!mech) {
        return jsonResponse({ success: true, verified: false, status: 'incomplete', message: 'No KYC application found.', orders: [] });
      }
      if (mech.verification_status !== 'verified') {
        return jsonResponse({ success: true, verified: false, status: 'pending', mechanic: mech, message: 'Your profile is pending admin verification.', orders: [] });
      }

      const { results } = await env.DB.prepare("SELECT * FROM orders WHERE status = 'searching_mechanic' ORDER BY created_at DESC").all();
      return jsonResponse({ success: true, verified: true, status: 'verified', mechanic: mech, orders: results || [] });
    }

    // Mechanic accepts an order
    if (url.pathname.startsWith('/api/orders/') && url.pathname.endsWith('/accept') && request.method === 'POST') {
      const session = await authenticateRequest(request, env);
      if (!session) return jsonResponse({ error: 'Unauthorized: Authentication required' }, 401);

      const orderId = url.pathname.split('/')[3];
      try {
        const body = await request.json();
        const { userId } = body;
        if (!userId) return jsonResponse({ error: 'Missing mechanic userId' }, 400);
        if (session.userId !== userId && session.role !== 'admin') return jsonResponse({ error: 'Forbidden: Cannot accept order on behalf of another mechanic' }, 403);

        const mech = await env.DB.prepare("SELECT * FROM mechanics WHERE user_id = ? AND verification_status = 'verified'").bind(userId).first();
        if (!mech) return jsonResponse({ error: 'Only verified mechanics can accept orders' }, 403);

        const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ? AND status = 'searching_mechanic'").bind(orderId).first();
        if (!order) return jsonResponse({ error: 'Order is no longer available or already accepted' }, 409);

        await env.DB.prepare(
          `UPDATE orders SET status = 'accepted', mechanic_id = ?, mechanic_name = ?, mechanic_phone = ? WHERE id = ?`
        ).bind(mech.id, mech.full_name, mech.phone, orderId).run();

        return jsonResponse({
          success: true,
          message: 'Job accepted successfully!',
          orderId,
          mechanic: { id: mech.id, name: mech.full_name, phone: mech.phone }
        });
      } catch (err) {
        return jsonResponse({ error: 'Failed to accept order', details: err.message }, 500);
      }
    }

    // 404
    return jsonResponse({ error: 'Not Found' }, 404);
  },
};
