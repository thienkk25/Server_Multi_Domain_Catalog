import supabase from '../configs/supabase.js'
import {
    applySearch,
    applyFilters,
    applySort,
    emptyPagination
} from '../utils/query.builder.js'

function applyDomainFilter(qb, apiKey, field) {
    // Không có apiKey -> chặn
    if (!apiKey) {
        return { qb, restricted: true }
    }

    const allowedDomainIds = apiKey.allowedDomainIds

    // Nếu có cấu hình nhưng rỗng không được truy cập domain nào
    if (allowedDomainIds.length === 0) {
        return { qb, restricted: true }
    }

    // Apply filter theo field (id hoặc domain_id)
    qb = qb.in(field, allowedDomainIds)

    return { qb, restricted: false }
}

const getDomains = async (query, apiKey) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from('domain')
        .select("id", { count: "exact", head: true })

    const roleResult = applyDomainFilter(countQb, apiKey, "id")

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
        .from('domain')
        .select("id,code,name")

    const roleResult2 = applyDomainFilter(dataQb, apiKey, "id")

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

const getDomainById = async (id, apiKey) => {
    let query = supabase
        .from('domain')
        .select('*')
        .eq('id', id)

    const result = applyDomainFilter(query, apiKey, 'id')

    if (result.restricted) {
        throw new Error("Không có quyền truy cập domain này")
    }

    const { data, error } = await result.qb.maybeSingle()

    if (error) throw error
    return data
}

const getCategoryGroups = async (query, apiKey) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit

    let countQb = supabase
        .from('category_group')
        .select("id", { count: "exact", head: true })

    const roleResult = applyDomainFilter(countQb, apiKey, "domain_id")

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
        .from('category_group')
        .select(`
            id,
            code,
            name,
            description,
            domain:domain_id (
                id,
                code,
                name
            ),
            created_at,
            updated_at
        `)

    const roleResult2 = applyDomainFilter(dataQb, apiKey, "domain_id")

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

const getCategoryGroupById = async (id, apiKey) => {

    let qb = supabase
        .from('category_group')
        .select(`
            id,
            code,
            name,
            description,
            domain:domain_id (
                id,
                code,
                name
            ),
            created_at,
            updated_at
        `)
        .eq('id', id)

    const result = applyDomainFilter(qb, apiKey, 'domain_id')

    if (result.restricted) {
        throw new Error("Không có quyền truy cập nhóm này")
    }

    qb = result.qb

    const { data, error } = await qb.maybeSingle()
    if (error) throw error

    return data
}

const getCategoryItems = async (query, apiKey) => {

    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit

    let countQb = supabase
        .from("category_item_view")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")

    const roleResult = applyDomainFilter(countQb, apiKey, "domain_id")

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
        .from("category_item_view")
        .select("*")
        .eq("status", "active")


    const roleResult2 = applyDomainFilter(dataQb, apiKey, "domain_id")

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
        serverTime: new Date().toISOString(),
        items: data
    }
}

const getCategoryItemById = async (id, apiKey) => {

    let qb = supabase
        .from('category_item_view')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')

    const result = applyDomainFilter(qb, apiKey, 'domain_id')

    if (result.restricted) {
        throw new Error("Không có quyền truy cập nhóm này")
    }

    const { data, error } = await result.qb.maybeSingle()

    if (error) throw error

    return data
}

const syncCategoryItems = async (query, apiKey) => {

    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    const { updated_from } = query

    let countQb = supabase
        .from("category_item_view")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")

    if (updated_from) {
        countQb = countQb.gte("updated_at", updated_from)
    }

    const countFilter = applyDomainFilter(countQb, apiKey, "domain_id")

    if (countFilter.restricted) {
        return {
            serverTime: new Date().toISOString(),
            items: [],
            pagination: {
                page,
                limit,
                total: 0,
                total_pages: 0,
                has_more: false
            }
        }
    }

    countQb = countFilter.qb

    countQb = applySearch(countQb, query.search, ["code", "name"])
    countQb = applyFilters(countQb, query.filter)

    const { count, error: countError } = await countQb
    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    if (page > totalPages && totalPages !== 0) {
        return {
            serverTime: new Date().toISOString(),
            items: [],
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
        .from("category_item_view")
        .select("*")
        .eq("status", "active")

    if (updated_from) {
        dataQb = dataQb.gte("updated_at", updated_from)
    }

    const dataFilter = applyDomainFilter(dataQb, apiKey, "domain_id")

    if (dataFilter.restricted) {
        return {
            serverTime: new Date().toISOString(),
            items: [],
            pagination: {
                page,
                limit,
                total: 0,
                total_pages: 0,
                has_more: false
            }
        }
    }

    dataQb = dataFilter.qb

    dataQb = applySearch(dataQb, query.search, ["code", "name"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(
        dataQb,
        query,
        ["created_at", "updated_at", "code", "name", "status"]
    )

    const { data, error } = await dataQb
        .range(offset, offset + limit - 1)

    if (error) throw error

    return {
        serverTime: new Date().toISOString(),
        items: data,
        pagination: {
            page,
            limit,
            total,
            total_pages: totalPages,
            has_more: page < totalPages
        }
    }
}

export const catalogService = {
    getDomains,
    getDomainById,
    getCategoryGroups,
    getCategoryGroupById,
    getCategoryItems,
    getCategoryItemById,
    syncCategoryItems,
}