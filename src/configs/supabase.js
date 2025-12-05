import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonPublic = process.env.SUPABASE_ANON_PUBLIC
const supabase = createClient(supabaseUrl, supabaseAnonPublic, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
})

export default supabase