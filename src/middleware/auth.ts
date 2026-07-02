import { Context, Next } from 'hono';
import { adminAuth } from '../lib/firebase-admin.ts';

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing token' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  // Keep mock tokens for local testing if necessary
  if (token.startsWith('mock-token-')) {
    const email = token.replace('mock-token-', '');
    c.set('user', {
      uid: 'mock-user-id',
      email: email
    });
    return await next();
  }
  
  if (token === 'mock-token') {
    c.set('user', {
      uid: 'mock-user-id',
      email: 'nkjoy@fandomaurora.com'
    });
    return await next();
  }
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    c.set('user', {
      uid: decodedToken.uid,
      email: decodedToken.email
    });
    return await next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
}
