import { supabase } from "../configs/supabase.js"

const getAll = async () => {

    const { data: activity_log, error } = await supabase.supabaseClient
        .from('activity_log')
        .select('*')

    if (error) throw error

    return activity_log

}

export const activityLogService = {
    getAll
}