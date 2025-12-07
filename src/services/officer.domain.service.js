import { supabase } from '../configs/supabase.js'

const getAll = async () => {

    const { data: officer_domain, error } = await supabase.supabaseClient
        .from('officer_domain')
        .select('*')

    if (error) throw error

    return officer_domain
}

const getById = async (id) => {
    const { data: officer_domain, error } = await supabase.supabaseClient
        .from('officer_domain')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return officer_domain
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('officer_domain')
        .insert(payload)
        .select()
        .single()

    if (error) throw error
    return data
}

const createMany = async (payloadList) => {
    const { data, error } = await supabase.supabaseClient
        .from('officer_domain')
        .insert(payloadList)
        .select()

    if (error) throw error
    return data
}

const upsertMany = async (items) => {
    const { data, error } = await supabase.supabaseClient
        .from('officer_domain')
        .upsert(items, { onConflict: 'id' })
        .select()

    if (error) throw error
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('officer_domain')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('officer_domain')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const officerDomainService = {
    getAll, getById, create, createMany, upsertMany, update, remove
}