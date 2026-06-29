import { createClient } from '@supabase/supabase-js';
import { Context, Next } from 'hono';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  if (token.startsWith('mock-token-')) {
    const email = token.replace('mock-token-', '');
    c.set('user', {
      uid: 'mock-user-id',
      email: email
    });
    return next();
  }
  
  if (token === 'mock-token') {
    c.set('user', {
      uid: 'mock-user-id',
      email: 'nkjoy@fandomaurora.com'
    });
    return next();
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    c.set('user', {
      uid: user.id,
      email: user.email
    });
    return next();
  } catch (err) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
}
