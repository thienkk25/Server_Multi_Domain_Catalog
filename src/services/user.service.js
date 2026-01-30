import { supabase } from '../configs/supabase.js'

const changePassword = async ({ new_password }) => {
    if (
        new_password.length < 8 ||
        !/[A-Z]/.test(new_password) ||
        !/\d/.test(new_password)
    ) {
        throw new Error('Invalid password');
    }


    const { error } = await supabase.supabaseClient.auth.updateUser({
        password: new_password
    });

    if (error) {
        throw error
    }

    return getProfile()
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

    const { error } = await supabase.supabaseClient.auth.updateUser({
        data: payload
    })

    if (error) {
        throw error
    }

    return getProfile()
}

const getProfile = async () => {
    const { data, error } = await supabase.supabaseClient
        .from('profile')
        .select('*')
        .maybeSingle()

    if (error) {
        throw error
    }
    return data
}

const role = async (id) => {
    const { data: userRole, error } = await supabase.supabaseSuperAdmin
        .from("user_role")
        .select("role:role_id(*)")
        .eq("user_id", id)
        .maybeSingle()
    if (error) {
        throw error
    }
    return userRole
}

export const userService = {
    changePassword, updateProfile, getProfile, role
}