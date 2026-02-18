import supabase from '../configs/supabase.js'

const getAll = async (user, query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit
    const { count, error: countError } = await supabase
        .from("category_item_version")
        .select("*", { count: "exact", head: true });

    if (countError) throw new Error(countError.message);

    const totalPages = Math.ceil((count || 0) / limit);

    if (page > totalPages && totalPages !== 0) {
        return {
            data: [],
            pagination: {
                page,
                limit,
                total: count,
                total_pages: totalPages,
                has_more: false
            }
        };
    }
    // Khởi tạo query builder
    let qb
    if (user != null) {
        qb = supabase
            .from("category_item_version")
            .select("*", { count: "exact" })
    }
    else {
        qb = supabase
            .from("category_item_version_public")
            .select("*", { count: "exact" })
    }

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

    const { data, error } = await qb

    if (error) throw error

    const hasMore = page * limit < count

    return {
        data,
        pagination: {
            page,
            limit,
            total: count,
            total_pages: totalPages,
            has_more: hasMore
        },
    }
}

const getVersionById = async (id) => {
    const { data, error } = await supabase
        .from('category_item_version')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) throw error
    return data
}

// domain officer 

const createVersion = async (user_id, {
    version_data,
    legal_document_ids = []
}) => {
    const { data: versionId, error } = await supabase
        .rpc(
            'do_create_category_item_version',
            {
                p_new_data: version_data,
                p_user_id: user_id
            }
        )

    if (error) throw error

    const { error: error_legal_document_ids } = await supabase
        .rpc('update_category_item_version_legals', {
            p_version_id: versionId,
            p_legal_ids: legal_document_ids
        })

    if (error_legal_document_ids) throw error

    return getVersionById(versionId)
}

const updateVersion = async (id, user_id, {
    version_type,
    version_data,
    legal_document_ids = []
}) => {
    let versionId
    if (version_type == 0) {
        const { data: version_id, error } = await supabase
            .rpc(
                'do_update_category_item_version',
                {
                    p_item_id: id,
                    p_new_data: version_data,
                    p_user_id: user_id
                }
            )

        if (error) throw error

        versionId = version_id
    } else

        if (version_type == 1) {
            const { data: version_id, error } = await supabase
                .rpc(
                    'do_update_pending_category_item_version',
                    {
                        p_version_id: id,
                        p_new_data: version_data,
                        p_user_id: user_id
                    }
                )

            if (error) throw error

            versionId = version_id
        }

    if (!versionId) {
        throw new Error('versionId is null/undefined')
    }

    const { error: error_legal_document_ids } = await supabase
        .rpc('update_category_item_version_legals', {
            p_version_id: versionId,
            p_legal_ids: legal_document_ids
        })

    if (error_legal_document_ids) throw error_legal_document_ids

    return getVersionById(versionId)
}

const deleteVersion = async (id, user_id) => {
    const { data: versionId, error } = await supabase
        .rpc(
            'do_delete_category_item_version',
            {
                p_item_id: id,
                p_user_id: user_id
            }
        )

    if (error) throw error

    return getVersionById(versionId)
}

// approver

const approveVersion = async (id) => {
    const { error } = await supabase
        .rpc(
            'approve_category_item_version',
            { p_version_id: id }
        )

    if (error) throw error;

    return getVersionById(id)
}

const rejectVersion = async (id, rejectReason) => {
    const { error } = await supabase
        .rpc(
            'reject_category_item_version',
            {
                p_version_id: id,
                p_reject_reason: rejectReason
            }
        )

    if (error) throw error;

    return getVersionById(id)
}

// admin or domain officer with status = pending

const remove = async (id) => {
    const { error } = await supabase
        .from('category_item_version')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// admin

const rollbackVersion = async (id, user_id) => {
    const { data: versionId, error } = await supabase
        .rpc(
            'admin_rollback_category_item_version',
            {
                p_version_id: id,
                p_user_id: user_id
            }
        )

    if (error) throw error

    return getVersionById(versionId)
}

export const categoryItemVersionService = {
    getAll, getVersionById, createVersion, updateVersion, deleteVersion, approveVersion, rejectVersion, remove, rollbackVersion
}