import supabase from '../configs/supabase.js'
import {
    applySearch,
    applyFilters,
    applySort
} from '../utils/query.builder.js'

const getAll = async (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from('profile')
        .select("id", { count: "exact", head: true })

    countQb = applySearch(countQb, query.search, ["email", "full_name", "phone"])
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
        .from("profile")
        .select("*")

    dataQb = applySearch(dataQb, query.search, ["email", "full_name", "phone"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(dataQb, query, ["created_at", "updated_at", "email", "full_name", "phone", "status"])

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
    const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw error

    return data
}

const create = async ({ email, password, user_metadata }) => {
    if (password == null || password == '' || password == undefined) {
        password = '12345678'
    }
    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: user_metadata,
        email_confirm: true,
        phone_confirm: false,
    })
    if (error) throw error

    return getById(data.user.id)

}

const update = async ({ id, password, user_metadata }) => {
    const { data: current, error: getError } =
        await supabase.auth.admin.getUserById(id)

    if (getError) throw getError

    const payload = {}

    if (password && password.trim() !== '') {
        payload.password = password
    }

    // MERGE user_metadata
    if (user_metadata && Object.keys(user_metadata).length > 0) {
        payload.user_metadata = {
            ...(current.user.user_metadata ?? {}),
            ...user_metadata,
        }
    }

    const { error } = await supabase.auth.admin.updateUserById(id, payload)
    if (error) throw error

    return getById(id)
}



const remove = async (userId) => {
    const { error: authError } =
        await supabase.auth.admin.deleteUser(userId)

    if (authError) throw authError

    const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

    if (dbError) throw dbError

}


const activateUser = async (userId) => {
    const { error } = await supabase
        .from('users')
        .update({ status: 'active' })
        .eq('id', userId)

    if (error) throw error

    return getById(userId)

}


const deactivateUser = async (userId) => {
    const { error } = await supabase
        .from('users')
        .update({ status: 'inactive' })
        .eq('id', userId)

    if (error) throw error

    await supabase.auth.admin.signOut(userId)

    return getById(userId)

}

const grantUserAccess = async (userId, roleId, domainIds = []) => {
    if (!userId || !roleId) {
        throw new Error('Dữ liệu không hợp lệ')
    }

    // Update role
    const { error: roleError } = await supabase
        .from('user_role')
        .update({ role_id: roleId })
        .eq('user_id', userId)

    if (roleError) throw roleError

    // Nếu KHÔNG phải domainOfficer → xoá domain
    if (roleId == 1) {
        await supabase
            .from('officer_domain')
            .delete()
            .eq('user_id', userId)

        return getById(userId)
    }

    // DomainOfficer → cần >= 1 domain
    if (!Array.isArray(domainIds) || domainIds.length === 0) {
        throw new Error('Người dùng có vai trò Cán bộ chuyên môn hoặc Chuyên viên duyệt phải quản lý tối thiểu một lĩnh vực')
    }

    // Reset domain cũ
    await supabase
        .from('officer_domain')
        .delete()
        .eq('user_id', userId)

    // Insert nhiều domain
    const payload = domainIds.map(domainId => ({
        user_id: userId,
        domain_id: domainId
    }))

    const { error: domainError } = await supabase
        .from('officer_domain')
        .insert(payload)

    if (domainError) throw domainError

    return getById(userId)
}

export const authAdminService = {
    getAll, getById, create, update, remove, activateUser, deactivateUser, grantUserAccess
}