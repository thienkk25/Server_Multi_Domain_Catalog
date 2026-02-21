import supabase from '../configs/supabase.js'
import {
    applySearch,
    applyFilters,
    applySort
} from '../utils/query.builder.js'

const getAll = async (query, role, isPublic = false) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit

    let countQb = supabase
        .from("category_item_view")
        .select("id", { count: "exact", head: true })

    if (isPublic) {
        countQb = countQb.eq("status", "active")
    }

    if (
        (role?.code === "domainOfficer" || role?.code === "approver") &&
        Array.isArray(role?.domains) &&
        role.domains.length > 0
    ) {
        countQb = countQb.in("domain_id", role.domains)
    }

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

    if (isPublic) {
        dataQb = dataQb.eq("status", "active")
    }

    if (
        (role?.code === "domainOfficer" || role?.code === "approver") &&
        Array.isArray(role?.domains) &&
        role.domains.length > 0
    ) {
        dataQb = dataQb.in("domain_id", role.domains)
    }

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

const getById = async (id, role, isPublic = false) => {
    let qb = supabase
        .from('category_item_view')
        .select('*')
        .eq('id', id)

    if (isPublic) {
        qb = qb.eq('status', 'active')
    }

    if (role?.code === 'domainOfficer' || role?.code === 'approver') {
        qb = qb.in('domain_id', role.domains)
    }

    const { data, error } = await qb.single()

    if (error) throw error

    return data
}

const create = async (user_id, role, {
    category_item,
    legal_document_ids = []
}) => {
    const { data: item_id, error } = await supabase
        .rpc(
            'admin_create_item',
            {
                p_data: category_item,
                user_id: user_id
            }
        )

    if (error) {
        if (error.code === '23505') {
            throw new Error('Mã hoặc tên mục danh mục đã tồn tại')
        }
        throw error
    }

    const { error: error_legal_document_ids } = await supabase
        .rpc('update_category_item_legals', {
            p_item_id: item_id,
            p_legal_ids: legal_document_ids
        })

    if (error_legal_document_ids) throw error

    return getById(item_id, role)
}

const update = async (id, user_id, role, {
    category_item,
    legal_document_ids = []
}) => {
    const { error } = await supabase
        .rpc(
            'admin_update_item',
            {
                p_item_id: id,
                p_new_value: category_item,
                user_id: user_id
            }
        )

    if (error) throw error;

    const { error: error_legal_document_ids } = await supabase
        .rpc('update_category_item_legals', {
            p_item_id: id,
            p_legal_ids: legal_document_ids
        })

    if (error_legal_document_ids) throw error

    return getById(id, role);
}

const remove = async (id) => {
    const { error } = await supabase
        .from('category_item')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryItemService = {
    getAll, getById, create, update, remove
}