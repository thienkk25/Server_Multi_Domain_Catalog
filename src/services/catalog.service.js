import supabase from '../configs/supabase.js'

const getDomains = async () => {
    const { data, error } = await supabase
        .from('domain')
        .select('id, code, name')
        .order('name')

    if (error) throw error
    return data
}

const getDomainById = async (id) => {
    const { data, error } = await supabase
        .from('domain')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

const getCategoryGroups = async ({ domain_id }) => {
    let query = supabase
        .from('category_group')
        .select('id, code, name')
        .order('name')

    if (domain_id) {
        query = query.eq('domain_id', domain_id)
    }

    const { data, error } = await query

    if (error) throw error
    return data
}

const getCategoryGroupById = async (id) => {
    const { data, error } = await supabase
        .from('category_group')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

const getCategoryItems = async ({
    group_id,
    keyword
}) => {

    let query = supabase
        .from('category_item')
        .select(`
            id,
            code,
            name,
            description,
            group_id,
            status,
            updated_at
        `)
        .eq('status', 'active')
        .order('name')

    if (group_id) {
        query = query.eq('group_id', group_id)
    }

    if (keyword) {
        query = query.or(`code.ilike.%${keyword}%,name.ilike.%${keyword}%`)
    }

    const { data, error } = await query
    if (error) throw error

    return data
}
const getCategoryItemById = async (id) => {

    const { data, error } = await supabase
        .from('category_item')
        .select(`
            id,
            code,
            name,
            description,
            group_id,
            status,
            created_at,
            updated_at
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single()

    if (error) throw error

    return data
}

const syncCategoryItems = async ({ updated_from }) => {

    let query = supabase
        .from('category_item')
        .select(`
            id,
            code,
            name,
            description,
            group_id,
            status,
            updated_at
        `)
        .eq('status', 'active')
        .order('updated_at')

    if (updated_from) {
        query = query.gte('updated_at', updated_from)
    }

    const { data, error } = await query
    if (error) throw error

    return {
        serverTime: new Date().toISOString(),
        items: data
    }
}

export const catalogService = {
    getDomains,
    getDomainById,
    getCategoryGroups,
    getCategoryGroupById,
    getCategoryItems,
    getCategoryItemById,
    syncCategoryItems,
}