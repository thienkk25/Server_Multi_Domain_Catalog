import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: legal_document, error } = await supabase.supabaseClient
        .from('legal_document')
        .select('*')

    if (error) throw error

    return legal_document
}

const getById = async (id) => {
    const { data: legal_document, error } = await supabase.supabaseClient
        .from('legal_document')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return legal_document
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('legal_document')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('legal_document')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('legal_document')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('legal_document')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('legal_document')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const legalDocumentService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}