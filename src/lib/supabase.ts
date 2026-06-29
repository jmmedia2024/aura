/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Using mock client.');
  
  // Create a mock auth state
  let mockUser = null as any;
  let mockSession = null as any;
  let listeners: any[] = [];

  const notifyListeners = () => {
    listeners.forEach(fn => fn('SIGNED_IN', mockSession));
  };

  client = {
    auth: {
      getSession: async () => ({ data: { session: mockSession } }),
      getUser: async () => ({ data: { user: mockUser }, error: null }),
      onAuthStateChange: (fn: any) => {
        listeners.push(fn);
        return { data: { subscription: { unsubscribe: () => { listeners = listeners.filter(l => l !== fn); } } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        mockUser = { id: 'mock-user-id', email };
        mockSession = { access_token: `mock-token-${email}`, user: mockUser };
        notifyListeners();
        return { data: { user: mockUser, session: mockSession }, error: null };
      },
      signUp: async ({ email, password }: any) => {
         mockUser = { id: 'mock-user-id', email };
         mockSession = { access_token: `mock-token-${email}`, user: mockUser };
         notifyListeners();
         return { data: { user: mockUser, session: mockSession }, error: null };
      },
      signOut: async () => {
        mockUser = null;
        mockSession = null;
        listeners.forEach(fn => fn('SIGNED_OUT', null));
        return { error: null };
      }
    },
    from: () => ({
      insert: async () => ({ data: null, error: null }),
      select: () => ({ eq: async () => ({ data: [], error: null }) })
    })
  };
} else {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;
