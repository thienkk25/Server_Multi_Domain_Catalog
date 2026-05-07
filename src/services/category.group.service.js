import supabase from '../configs/supabase.js'

import {
    applyRoleFilter,
    applySearch,
    applyFilters,
    applySort,
    emptyPagination
} from '../utils/query.builder.js'

const TABLE_NAME = 'category_group'

const getAll = async (query, role) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit

    let countQb = supabase
        .from(TABLE_NAME)
        .select("id", { count: "exact", head: true })

    const roleResult = applyRoleFilter(countQb, role, "domain_id")

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
        .select(`
            id,
            code,
            name,
            description,
            image_url,
            domain:domain_id (
                id,
                code,
                name
            ),
            created_at,
            updated_at
        `)

    const roleResult2 = applyRoleFilter(dataQb, role, "domain_id")

    if (roleResult2.restricted) {
        return emptyPagination(page, limit)
    }

    dataQb = roleResult2.qb
    dataQb = applySearch(dataQb, query.search, ["code", "name"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(dataQb, query, ["created_at", "updated_at", "code", "name"])

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
        .select(`
            id,
            code,
            name,
            description,
            image_url,
            domain:domain_id (
                id,
                code,
                name
            ),
            created_at,
            updated_at
        `)
        .eq('id', id)

    if (role?.code === 'domainOfficer' || role?.code === 'approver') {
        qb = qb.in('domain_id', role.domains)
    }

    const { data, error } = await qb.single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null
        }
        throw new Error(error.message)
    }

    return data
}

const lookup = async (role, query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit


    if (!Array.isArray(query.domain_ids)) {
        query.domain_ids = query.domain_ids ? [query.domain_ids] : [];
    }

    let countQb = supabase
        .from(TABLE_NAME)
        .select("id", { count: "exact", head: true })
        .in("domain_id", query.domain_ids)

    const roleCount = applyRoleFilter(countQb, role, "domain_id")
    if (roleCount.restricted) return emptyPagination(page, limit)

    const { count, error: countError } = await roleCount.qb
    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    let dataQb = supabase
        .from(TABLE_NAME)
        .select("id, code, name")
        .in("domain_id", query.domain_ids)

    const roleData = applyRoleFilter(dataQb, role, "domain_id")
    if (roleData.restricted) return emptyPagination(page, limit)

    const { data, error } = await roleData.qb
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

const create = async (role, payload) => {
    if (!role.domains?.includes(payload.domain_id) && role.code !== 'admin') {
        throw new Error("Bạn không được phép tạo nhóm cho lĩnh vực này.")
    }

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            throw new Error('Mã hoặc tên nhóm danh mục đã tồn tại')
        }
        throw error
    }
    return getById(data.id, role)
}

const update = async (id, role, payload) => {
    if (!role.domains?.includes(payload.domain_id) && role.code !== 'admin') {
        throw new Error("Bạn không được phép cập nhật nhóm cho lĩnh vực này.")
    }

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error
    return getById(data.id, role)
}

const remove = async (id, role) => {

    const { data: payload, error: payloadError } = await supabase
        .from(TABLE_NAME)
        .select('domain_id')
        .eq('id', id)
        .single()

    if (payloadError) throw payloadError

    if (!role.domains?.includes(payload.domain_id) && role.code !== 'admin') {
        throw new Error("Bạn không được phép xóa nhóm cho lĩnh vực này.")
    }

    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryGroupService = {
    getAll, getById, create, update, remove, lookup
}