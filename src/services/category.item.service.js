import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: category_item, error } = await supabase.supabaseClient
        .from('category_item')
        .select('*')

    if (error) throw error

    return category_item
}

const getById = async (id) => {
    const { data: category_item, error } = await supabase.supabaseClient
        .from('category_item')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return category_item
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('category_item')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryItemService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}