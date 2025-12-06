import { supabase } from '../configs/supabase.js'

const changePasswordUser = async ({ new_password }) => {
    const { data, error } = await supabase.auth.updateUser({
        password: new_password
    });

    if (error) {
        throw error
    }

    return data
};

const updatePhoneUser = async ({ new_phone }) => {
    const { data, error } = await supabase.auth.updateUser({
        data: { phone: new_phone }
    })

    if (error) {
        throw error
    }

    return data
}

const updateFullNameUser = async ({ full_name }) => {
    const { data, error } = await supabase.auth.updateUser({
        data: { full_name: full_name }
    })

    if (error) {
        throw error
    }

    return data
}

export const userService = {
    changePasswordUser, updateFullNameUser, updatePhoneUser
}