import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: category_group, error } = await supabase.supabaseClient
        .from('category_group')
        .select('*')

    if (error) throw error

    return category_group
}

const getById = async (id) => {
    const { data: category_group, error } = await supabase.supabaseClient
        .from('category_group')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return category_group
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_group')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_group')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_group')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_group')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('category_group')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryGroupService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}