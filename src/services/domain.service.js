import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: domain, error } = await supabase.supabaseClient
        .from('domain')
        .select('*')

    if (error) throw error

    return domain
}

const getById = async (id) => {
    const { data: domain, error } = await supabase.supabaseClient
        .from('domain')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return domain
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (domains) => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .upsert(domains, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('domain')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const domainService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}