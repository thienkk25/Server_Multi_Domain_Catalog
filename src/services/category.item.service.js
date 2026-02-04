import { supabase } from '../configs/supabase.js'

const getAll = async (query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit

    // Khởi tạo query builder
    let qb = supabase.supabaseClient
        .from("category_item_view")
        .select("*", { count: "exact" });

    if (query.search) {
        const s = query.search;

        qb = qb.or(
            `code.ilike.%${s}%,name.ilike.%${s}%`
        )
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
    const { data: category_item, error } = await supabase.supabaseClient
        .from('category_item_view')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return category_item
}

const create = async ({
    category_item,
    legal_document_ids = []
}) => {
    const { data: item_id, error } = await supabase.supabaseClient
        .rpc(
            'admin_create_item',
            {
                p_data: category_item
            }
        )

    if (error) {
        if (error.code === '23505') {
            throw new Error('Mã hoặc tên mục danh mục đã tồn tại')
        }
        throw error
    }

    const { error: error_legal_document_ids } = await supabase.supabaseClient.rpc('update_category_item_legals', {
        p_item_id: item_id,
        p_legal_ids: legal_document_ids
    })

    if (error_legal_document_ids) throw error

    return getById(item_id)
}

const update = async (id, {
    category_item,
    legal_document_ids = []
}) => {
    const { error } = await supabase.supabaseClient
        .rpc(
            'admin_update_item',
            {
                p_item_id: id,
                p_new_value: category_item
            }
        )

    if (error) throw error;

    const { error: error_legal_document_ids } = await supabase.supabaseClient.rpc('update_category_item_legals', {
        p_item_id: id,
        p_legal_ids: legal_document_ids
    })

    if (error_legal_document_ids) throw error

    return getById(id);
}

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('category_item')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const categoryItemService = {
    getAll, getById, create, update, remove
}