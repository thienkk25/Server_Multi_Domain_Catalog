import { supabase } from '../configs/supabase.js'

const changePassword = async ({ new_password }) => {
    const { data, error } = await supabase.supabaseClient.auth.updateUser({
        password: new_password
    });

    if (error) {
        throw error
    }

    return data
}

const updateProfile = async ({ phone, full_name }) => {
    const payload = {}

    if (phone !== undefined) {
        const regPhone = /^(?:\+84|0084|0)(3|5|7|8|9)[0-9]{8}$/;

        if (!regPhone.test(phone)) {
            throw new Error('Invalid phone number');
        }

        payload.phone = phone;
    }

    if (full_name !== undefined) payload.full_name = full_name

    if (Object.keys(payload).length === 0) {
        throw new Error('No data to update')
    }

    const { data, error } = await supabase.supabaseClient.auth.updateUser({
        data: payload
    })

    if (error) {
        throw error
    }

    return data
}


const me = async () => {
    const { data, error } = await supabase.supabaseClient.auth.getUser()
    if (error) {
        throw error
    }
    return data
}

const getProfile = async () => {
    const { data, error } = await supabase.supabaseClient
        .from('profile')
        .select('*')
        .single()

    if (error) {
        throw error
    }
    return data
}

const role = async (id) => {
    const { data: userRole, error } = await supabase.supabaseSuperAdmin
        .from("user_role")
        .select("role:role_id(code)")
        .eq("user_id", id)
        .single()
    if (error) {
        throw error
    }
    return userRole
}

export const userService = {
    changePassword, updateProfile, me, getProfile, role
}