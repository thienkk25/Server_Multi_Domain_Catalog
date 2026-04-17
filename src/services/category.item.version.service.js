import supabase from '../configs/supabase.js'
import {
    applyRoleFilter,
    applyFilters,
    applySearch,
    applySort
} from '../utils/query.builder.js'

const TABLE_NAME = 'category_item_version'

function applyVersionRole(qb, role, user_id) {
    if (role.code === "domainOfficer") {
        return qb.or(
            `status.eq.approved,change_by.eq.${user_id}`
        )
    }

    if (role.code === "approver") {
        return qb.or(
            `status.eq.approved,status.eq.pending,change_by.eq.${user_id},approved_by.eq.${user_id}`
        )
    }

    return qb
}

const getAll = async (query, user_id, role) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from('category_item_version_view')
        .select("id", { count: "exact", head: true })

    const roleResult = applyRoleFilter(countQb, role, "domain_id")

    if (roleResult.restricted) {
        return emptyPagination(page, limit)
    }

    countQb = roleResult.qb

    countQb = applyVersionRole(countQb, role, user_id)

    countQb = applyFilters(countQb, query.filter)
    countQb = applySearch(countQb, query.search, [
        "item->>code", "item->>name", 
        "new_value->>code", "new_value->>name", 
        "old_value->>code", "old_value->>name"
    ])

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
        .from('category_item_version_view')
        .select("*")

    const roleResult2 = applyRoleFilter(dataQb, role, "domain_id")

    if (roleResult2.restricted) {
        return emptyPagination(page, limit)
    }

    dataQb = roleResult2.qb

    dataQb = applyVersionRole(dataQb, role, user_id)

    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySearch(dataQb, query.search, [
        "item->>code", "item->>name", 
        "new_value->>code", "new_value->>name", 
        "old_value->>code", "old_value->>name"
    ])
    dataQb = applySort(dataQb, query, ["created_at", "applied_at", "updated_at", "status"])

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

const getHistoryVersion = async (item_id, role, query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from('category_item_version_view')
        .select("id", { count: "exact", head: true })

    countQb = countQb.eq("item_id", item_id)
    countQb = countQb.eq("status", 'approved')

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
        .from('category_item_version_view')
        .select("*")

    dataQb = dataQb.eq("item_id", item_id)
    dataQb = dataQb.eq("status", 'approved')
    dataQb = applySort(dataQb, query, ["created_at", "applied_at", "updated_at", "status"])

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

const getVersionById = async (id, user_id, role) => {

    let qb = supabase
        .from('category_item_version_view')
        .select("*")
        .eq("id", id)

    const { qb: filteredQb, restricted } =
        applyRoleFilter(qb, role, "domain_id")

    if (restricted) return null

    qb = filteredQb

    qb = applyVersionRole(qb, role, user_id)

    const { data, error } = await qb.single()

    if (error) {
        if (error.code === "PGRST116") return null
        throw error
    }

    return data
}

// domain officer 

const createVersion = async (user_id, role, {
    version_data,
    legal_document_ids = []
}) => {
    if (!role.domains?.includes(version_data.domain_id)) {
        throw new Error("Bạn không được phép tạo phiên bản cho lĩnh vực này.")
    }

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

    return getVersionById(versionId, user_id, role)
}

const updateVersion = async (id, user_id, role, {
    version_type,
    version_data,
    legal_document_ids = []
}) => {
    if (version_type == undefined || version_type == null || version_type == 'undefined') {
        version_type = 0
    }
    if (!role.domains?.includes(version_data.domain_id)) {
        throw new Error("Bạn không được phép cập nhật phiên bản cho lĩnh vực này.")
    }

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

    return getVersionById(versionId, user_id, role)
}

const deleteVersion = async (id, user_id, role, { domain_id }) => {

    if (!role.domains?.includes(domain_id)) {
        throw new Error("Bạn không được phép xóa phiên bản cho lĩnh vực này.")
    }

    const { data: versionId, error } = await supabase
        .rpc(
            'do_delete_category_item_version',
            {
                p_item_id: id,
                p_user_id: user_id,
                p_domain_id: domain_id
            }
        )

    if (error) throw error

    return getVersionById(versionId, user_id, role)
}

// approver

const approveVersion = async (id, user_id, role) => {
    const { error } = await supabase
        .rpc(
            'approve_category_item_version',
            {
                p_version_id: id,
                p_user_id: user_id

            }
        )

    if (error) throw error;

    return getVersionById(id, user_id, role)
}

const rejectVersion = async (id, rejectReason, user_id, role) => {
    const { error } = await supabase
        .rpc(
            'reject_category_item_version',
            {
                p_version_id: id,
                p_user_id: user_id,
                p_reject_reason: rejectReason
            }
        )

    if (error) throw error;

    return getVersionById(id, user_id, role)
}

// admin or domain officer with status = pending

const remove = async (id, role) => {

    let qb = supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

    if (role.code === "domainOfficer") {
        qb = qb.or(
            `status.eq.pending`
        )
    }

    const { error } = await qb

    if (error) throw error
}

// admin

const rollbackVersion = async (id, user_id, role) => {
    const { data: versionId, error } = await supabase
        .rpc(
            'admin_rollback_category_item_version',
            {
                p_version_id: id,
                p_user_id: user_id
            }
        )

    if (error) {
        if (error.code === '23505') {
            throw new Error('Không thể khôi phục phiên bản này. Mã hoặc tên mục danh mục đã tồn tại');
        }
        throw error
    }

    return getVersionById(versionId, user_id, role)
}

export const categoryItemVersionService = {
    getAll, getVersionById, createVersion, updateVersion, deleteVersion, approveVersion, rejectVersion, remove, rollbackVersion, getHistoryVersion
}