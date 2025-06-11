import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});

// Add error handling for connection status
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('No longer connected to Supabase');
  } else if (event === 'SIGNED_IN') {
    console.log('Connected to Supabase');
  }
});