import { supabase } from '../configs/supabase.js'

const getAll = async (query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit

    // Khởi tạo query builder
    let qb = supabase.supabaseSuperAdmin
        .from("admin_user_list")
        .select("*", { count: "exact" })


    if (query.search) {
        const s = query.search;

        qb = qb.or(
            `full_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,full_name.ilike.%${s}%`
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
    const { data, error } = await supabase.supabaseSuperAdmin
        .from("admin_user_list")
        .select("*")
        .eq("id", id)
        .maybeSingle()
    if (error) throw error

    return data
}

const create = async ({ email, password, user_metadata }) => {
    if (password == null || password == '' || password == undefined) {
        password = '12345678'
    }
    const { data, error } = await supabase.supabaseSuperAdmin.auth.admin.createUser({
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
        await supabase.supabaseSuperAdmin.auth.admin.getUserById(id)

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

    const { error } = await supabase.supabaseSuperAdmin.auth.admin.updateUserById(id, payload)
    if (error) throw error

    return getById(id)
}



const remove = async (userId) => {
    const { error: authError } =
        await supabase.supabaseSuperAdmin.auth.admin.deleteUser(userId)

    if (authError) throw authError

    const { error: dbError } = await supabase.supabaseClient
        .from('users')
        .delete()
        .eq('id', userId)

    if (dbError) throw dbError

}


const activateUser = async (userId) => {
    const { error } = await supabase.supabaseClient
        .from('users')
        .update({ status: 'active' })
        .eq('id', userId)

    if (error) throw error

    return getById(userId)

}


const deactivateUser = async (userId) => {
    const { error } = await supabase.supabaseClient
        .from('users')
        .update({ status: 'inactive' })
        .eq('id', userId)

    if (error) throw error

    await supabase.supabaseSuperAdmin.auth.admin.signOut(userId)

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
    if (roleId !== 3) {
        await supabase
            .from('officer_domain')
            .delete()
            .eq('user_id', userId)
        return
    }

    // DomainOfficer → cần >= 1 domain
    if (!Array.isArray(domainIds) || domainIds.length === 0) {
        throw new Error('Người dùng có vai trò Cán bộ chuyên môn phải quản lý tối thiểu một lĩnh vực')
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