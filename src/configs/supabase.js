import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL

const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE
const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
})

export default supabase