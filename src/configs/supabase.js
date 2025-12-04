import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonPublic = process.env.SUPABASE_ANON_PUBLIC
const supabase = createClient(supabaseUrl, supabaseAnonPublic)

export default supabase