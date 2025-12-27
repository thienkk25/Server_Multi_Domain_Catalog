import { supabase } from '../configs/supabase.js'

const getDomainsRef = async () => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .select('id, name')
        .order('name')

    if (error) throw error
    return data
}

const getCategoryGroupsRef = async (id) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_group')
        .select('id, name')
        .eq('domain_id', id)
        .order('name')

    if (error) throw error
    return data
}

const searchFlat = async ({
    keyword,
    domainId,
    groupId,
    limit,
    offset
}) => {
    const { data, error } = await this.supabase.rpc(
        'search_category_flat',
        {
            p_keyword: keyword || null,
            p_domain_id: domainId || null,
            p_group_id: groupId || null,
            p_limit: limit ?? 20,
            p_offset: offset ?? 0,
        }
    );

    if (error) throw error;
    return data;
}

export const catalogLookupService = {
    getDomainsRef, getCategoryGroupsRef, searchFlat
}