import { supabase } from '../configs/supabase.js'

const getAll = async () => {
    const { data: { users }, error } = await supabase.supabaseSuperAdmin.auth.admin.listUsers()
    if (error) throw error

    return users
}

const getById = async (id) => {
    const { data, error } = await supabase.supabaseSuperAdmin.auth.admin.getUserById(id)
    if (error) throw error

    return data
}

const create = async ({ email, password, userMetadata }) => {
    const { data, error } = await supabase.supabaseSuperAdmin.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: userMetadata
    })
    if (error) throw error

    return data
}

const remove = async (id) => {
    const { data, error } = await supabase.supabaseSuperAdmin.auth.admin.deleteUser(id)
    if (error) throw error

    return data
}

export const authAdminService = {
    getAll, getById, create, remove
}