import { supabase } from '../configs/supabase.js'

const getAll = async (query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit

    // Khởi tạo query builder
    let qb = supabase.supabaseClient
        .from("category_item_version")
        .select("*", { count: "exact" })

    if (query.item_id) {
        qb = qb.eq("item_id", query.item_id)
    }

    if (query.filter) {
        for (const key in query.filter) {
            const value = query.filter[key];

            // Nếu là array → checkbox nhiều giá trị
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    qb = qb.in(key, value);
                }
            }

            // Nếu là chuỗi → filter 1 giá trị
            else if (typeof value === "string" && value.trim() !== "") {
                qb = qb.eq(key, value);
            }
        }
    }

    const sortBy = query.sortBy || "created_at";
    const sortOrder = query.sort === "asc" ? true : false

    qb = qb.order(sortBy, { ascending: sortOrder })
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
    const { data: category_item_version, error } = await supabase.supabaseClient
        .from('category_item_version')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) throw error

    return category_item_version
}

// domain officer 

const createVersion = async ({
    version_data,
    legal_document_ids = []
}) => {
    const { data: versionId, error } = await supabase.supabaseClient
        .rpc(
            'do_create_category_item_version',
            { p_new_data: version_data }
        )

    if (error) throw error

    const { error: error_legal_document_ids } = await supabase.supabaseClient.rpc('update_category_item_legals', {
        p_item_id: versionId,
        p_legal_ids: legal_document_ids
    })

    if (error_legal_document_ids) throw error

    return getById(versionId)
}

const updateVersion = async (id, {
    version_data,
    legal_document_ids = []
}) => {
    const { error } = await supabase.supabaseClient
        .rpc(
            'do_update_category_item_version',
            {
                p_item_id: id,
                p_new_data: version_data
            }
        )

    if (error) throw error

    const { error: error_legal_document_ids } = await supabase.supabaseClient.rpc('update_category_item_legals', {
        p_item_id: id,
        p_legal_ids: legal_document_ids
    })

    if (error_legal_document_ids) throw error

    return getById(id);
}

const deleteVersion = async (id) => {
    const { error } = await supabase.supabaseClient
        .rpc(
            'do_delete_category_item_version',
            { p_item_id: id }
        )

    if (error) throw error
}

// approver

const approveVersion = async (id) => {
    const { error } = await supabase.supabaseClient
        .rpc(
            'approve_category_item_version',
            { p_version_id: id }
        )

    if (error) throw error;

    return getById(id)
}

const rejectVersion = async (id, rejectReason) => {
    const { error } = await supabase.supabaseClient
        .rpc(
            'reject_category_item_version',
            {
                p_version_id: id,
                p_reject_reason: rejectReason
            }
        )

    if (error) throw error;

    return getById(id)
}

// admin

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('category_item_version')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryItemVersionService = {
    getAll, getById, createVersion, updateVersion, deleteVersion, approveVersion, rejectVersion, remove
}