// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Real Supabase DB URL (not the Cloudflare proxy) — used for table queries
const supabaseDbUrl = import.meta.env.VITE_SUPABASE_DB_URL || supabaseUrl

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Change to false
    persistSession: true,
    detectSessionInUrl: false, // Change to false
    storageKey: 'saarathi-supabase-auth', // Unique key
    storage: localStorage,
    flowType: 'pkce', // Use PKCE flow
    debug: true // Enable debug mode
  },
  global: {
    headers: {
      'x-application-name': 'saarathi'
    },
    fetch: (...args) => {
      // Add timeout to fetch requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      return fetch(...args, {
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId))
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Separate client for direct DB table queries (bypasses Cloudflare proxy)
// Separate client for direct DB table queries (bypasses Cloudflare proxy)
// Resolves 403s by globally injecting the auth token from the main client on EVERY request
export const supabaseDb = createClient(
  'https://jqchzznzhcuqlpmqakmd.supabase.co',
  supabaseAnonKey,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
    global: {
      fetch: async (url, options) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const headers = new Headers(options?.headers || {});
          headers.set('Authorization', `Bearer ${session.access_token}`);
          headers.set('apikey', supabaseAnonKey);
          options.headers = headers;
        }
        return fetch(url, options);
      }
    }
  }
);

// This helper is kept as a no-op so it doesn't break component imports,
// but auth injection is now handled fully automatically by the fetch interceptor above.
export async function syncDbAuth() {
  return null;
}