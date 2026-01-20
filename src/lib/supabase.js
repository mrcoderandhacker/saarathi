// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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