import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: api_key, error } = await supabase.supabaseClient
        .from('api_key')
        .select('*')

    if (error) throw error

    return api_key
}

const getById = async (id) => {
    const { data: api_key, error } = await supabase.supabaseClient
        .from('api_key')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return api_key
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('api_key')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('api_key')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('api_key')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('api_key')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error
    return data
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('api_key')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const apiKeyService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}