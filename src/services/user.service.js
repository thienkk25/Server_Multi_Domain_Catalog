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

const updatePhone = async ({ new_phone }) => {
    const { data, error } = await supabase.supabaseClient.auth.updateUser({
        data: { phone: new_phone }
    })

    if (error) {
        throw error
    }

    return data
}

const updateFullName = async ({ full_name }) => {
    const { data, error } = await supabase.supabaseClient.auth.updateUser({
        data: { full_name: full_name }
    })

    if (error) {
        throw error
    }

    return data
}

export const userService = {
    changePassword, updateFullName, updatePhone
}