import supabase from '../configs/supabase.js'
import {
    applyRoleFilter,
    applySearch,
    applyFilters,
    applySort,
    emptyPagination
} from '../utils/query.builder.js'

const TABLE_NAME = 'domain'

const getAll = async (query, role) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from(TABLE_NAME)
        .select("id", { count: "exact", head: true })

    const roleResult = applyRoleFilter(countQb, role, "id")

    if (roleResult.restricted) {
        return emptyPagination(page, limit)
    }

    countQb = roleResult.qb
    countQb = applySearch(countQb, query.search, ["code", "name"])
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

    const roleResult2 = applyRoleFilter(dataQb, role, "id")

    if (roleResult2.restricted) {
        return emptyPagination(page, limit)
    }

    dataQb = roleResult2.qb
    dataQb = applySearch(dataQb, query.search, ["code", "name"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(dataQb, query, ["created_at", "updated_at", "code", "name", "status"])

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

const getById = async (id, role) => {

    let qb = supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)

    const roleResult = applyRoleFilter(qb, role, "id")

    if (roleResult.restricted) {
        return emptyPagination(page, limit)
    }

    qb = roleResult.qb

    const { data, error } = await qb.single()

    if (error) {
        if (error.code === 'PGRST116') {
            // Không tìm thấy hoặc không có quyền
            return null
        }
        throw new Error(error.message)
    }

    return data
}

const create = async (payload) => {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            throw new Error('Mã hoặc tên domain đã tồn tại')
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
        .single()

    if (error) throw error
    return data
}

const remove = async (id) => {
    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const domainService = {
    getAll, getById, create, update, remove
}