import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: category_item_version, error } = await supabase.supabaseClient
        .from('category_item_version')
        .select('*')

    if (error) throw error

    return category_item_version
}

const getById = async (id) => {
    const { data: category_item_version, error } = await supabase.supabaseClient
        .from('category_item_version')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return category_item_version
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_version')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_version')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_version')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_version')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('category_item_version')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryItemVersionService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}