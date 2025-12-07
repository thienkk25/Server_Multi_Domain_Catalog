import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: category_item_legal_ref, error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .select('*')

    if (error) throw error

    return category_item_legal_ref
}

const getById = async (id) => {
    const { data: category_item_legal_ref, error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return category_item_legal_ref
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('category_item_legal_ref')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryItemLegalRefService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}