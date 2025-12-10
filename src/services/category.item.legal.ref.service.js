import { supabase } from '../configs/supabase.js'

const getAll = async (query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit

    // Khởi tạo query builder
    let qb = supabase.supabaseClient
        .from("category_item_legal_ref")
        .select("*", { count: "exact" });

    qb = qb.order("id", { ascending: true })

    qb = qb.range(offset, offset + limit - 1)

    const { data, error, count } = await qb

    if (error) throw error

    return {
        data,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
        },
    }
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
        .single()

    if (error) throw error;
    return data
}

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