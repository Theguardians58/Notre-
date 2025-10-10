/**
 * Supabase Configuration
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

// Initialize Supabase client
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
}

// Export configuration
export { supabaseConfig };

// Database table names
export const tables = {
  notes: 'notes',
  users: 'users',
  presence: 'presence',
};
