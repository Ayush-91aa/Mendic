import { createClerkClient } from '@clerk/backend';

/**
 * Verifies the Clerk Bearer JWT from request headers and retrieves user role.
 * @param {Request} request 
 * @param {Object} env Cloudflare Worker environment bindings
 * @returns {Promise<{userId: string, role: string, payload: any} | null>}
 */
export async function authenticateRequest(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token || !env.CLERK_SECRET_KEY) {
    return null;
  }

  try {
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
    const payload = await clerk.verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });

    if (!payload || !payload.sub) {
      return null;
    }

    // Resolve user role from JWT claims or fallback to D1 database lookup
    let role = payload.public_metadata?.role || payload.metadata?.role || payload.role;
    
    if (!role && env.DB) {
      try {
        const dbUser = await env.DB.prepare('SELECT role FROM users WHERE id = ?').bind(payload.sub).first();
        if (dbUser && dbUser.role) {
          role = dbUser.role;
        }
      } catch (dbErr) {
        console.error('Error looking up user role in D1:', dbErr);
      }
    }

    return {
      userId: payload.sub,
      role: role || 'customer',
      payload
    };
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return null;
  }
}
