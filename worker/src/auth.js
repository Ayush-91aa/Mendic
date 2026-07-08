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

const ADMIN_EMAILS = [
  'mendicindia@gmail.com',
  'divyaprakashsinghchauhan1234@gmail.com',
  'dpsc90071@gmail.com',
  'modulusfunctio9@gmail.com'
];

    // Resolve user role from JWT claims or fallback to D1 database lookup
    let role = payload.public_metadata?.role || payload.metadata?.role || payload.role;
    
    const email = payload.email || payload.email_address || payload?.primaryEmailAddress?.emailAddress || '';
    let isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    if (!role && env.DB) {
      try {
        const dbUser = await env.DB.prepare('SELECT role, email FROM users WHERE id = ?').bind(payload.sub).first();
        if (dbUser && dbUser.role) {
          role = dbUser.role;
        }
        if (dbUser && dbUser.email && ADMIN_EMAILS.includes(dbUser.email.toLowerCase())) {
          isAdmin = true;
        }
      } catch (dbErr) {
        console.error('Error looking up user role in D1:', dbErr);
      }
    }

    if (isAdmin) {
      role = 'admin';
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

/**
 * Verifies a Cloudflare Turnstile token against the /siteverify API.
 * @param {string} token The cf-turnstile-response token from frontend
 * @param {string} secretKey The TURNSTILE_SECRET_KEY from worker env
 * @param {string} [ip] Optional client IP
 * @returns {Promise<boolean>} True if verification succeeds
 */
export async function verifyTurnstileToken(token, secretKey, ip) {
  if (!token || !secretKey) {
    return !secretKey ? true : false;
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return false;
  }
}

/**
 * Checks Cloudflare rate limiting binding if configured.
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<{allowed: boolean, status: number, message?: string}>}
 */
export async function checkRateLimit(request, env) {
  if (!env.RATE_LIMITER) {
    return { allowed: true, status: 200 };
  }

  try {
    const ip = request?.headers?.get('cf-connecting-ip') || '127.0.0.1';
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return { allowed: false, status: 429, message: 'Too Many Requests: Please slow down and try again later.' };
    }
    return { allowed: true, status: 200 };
  } catch (err) {
    console.error('Rate limit check error:', err);
    return { allowed: true, status: 200 };
  }
}
