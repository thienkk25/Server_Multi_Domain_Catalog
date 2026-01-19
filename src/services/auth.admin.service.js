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
    const { data, error } = await supabase.supabaseSuperAdmin.auth.admin.getUserById(id)
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

    return data
}

const remove = async (userId) => {
    const { data: authData, error: authError } =
        await supabase.supabaseSuperAdmin.auth.admin.deleteUser(userId)

    if (authError) throw authError

    const { error: dbError } = await supabase.supabaseClient
        .from('users')
        .delete()
        .eq('id', userId)

    if (dbError) throw dbError

    return authData
}


const activateUser = async (userId) => {
    const { data, error } = await supabase.supabaseClient
        .from('users')
        .update({ status: 'active' })
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}


const deactivateUser = async (userId) => {
    const { data, error } = await supabase.supabaseClient
        .from('users')
        .update({ status: 'inactive' })
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}


export const authAdminService = {
    getAll, getById, create, remove, activateUser, deactivateUser
}