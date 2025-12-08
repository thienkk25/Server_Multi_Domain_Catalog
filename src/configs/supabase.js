import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonPublic = process.env.SUPABASE_ANON_PUBLIC
const supabaseClient = createClient(supabaseUrl, supabaseAnonPublic, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
})


const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE
const supabaseSuperAdmin = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

export const supabase = { supabaseClient, supabaseSuperAdmin }