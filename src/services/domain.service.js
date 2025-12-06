import { supabase } from '../configs/supabase.js'

const fetchDomain = async () => {

    const { data: domain, error } = await supabase
        .from('domain')
        .select('*')

    if (error) throw error

    return data
}