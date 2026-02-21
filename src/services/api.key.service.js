import supabase from '../configs/supabase.js'
import {
    applySearch,
    applyFilters,
    applySort
} from '../utils/query.builder.js'

const TABLE_NAME = 'api_key'

const getAll = async (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from(TABLE_NAME)
        .select("id", { count: "exact", head: true })

    countQb = applySearch(countQb, query.search, ["system_name"])
    countQb = applyFilters(countQb, query.filter)

    const { count, error: countError } = await countQb
    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    if (page > totalPages && totalPages !== 0) {
        return {
            data: [],
            pagination: {
                page,
                limit,
                total,
                total_pages: totalPages,
                has_more: false
            }
        }
    }

    let dataQb = supabase
        .from(TABLE_NAME)
        .select("*")

    dataQb = applySearch(dataQb, query.search, ["system_name"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(dataQb, query, ["created_at", "system_name", "status"])

    const { data, error } = await dataQb
        .range(offset, offset + limit - 1)

    if (error) throw error

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            total_pages: totalPages,
            has_more: page < totalPages
        }
    }
}

const getById = async (id) => {
    const { data: api_key, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return api_key
}

const create = async (payload) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            throw new Error('Tên Api Key đã tồn tại')
        }
        throw error
    }
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error
    return data
};

const remove = async (id) => {
    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const apiKeyService = {
    getAll, getById, create, update, remove
}