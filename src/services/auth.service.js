import { supabase } from '../configs/supabase.js'

const signInWithPassword = async ({ email, password }) => {
    const { data, error } = await supabase.supabaseClient.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        const errorMessages = {
            'Invalid login credentials': 'Email hoặc mật khẩu không đúng',
            'Email not confirmed': 'Email chưa được xác thực',
            'User not found': 'Người dùng không tồn tại'
        };

        const err = new Error(errorMessages[error.message] || error.message);
        err.status = 401;
        throw err;
    }
    return data
}

const register = async ({ email, password }) => {
    const { data, error } = await supabase.supabaseClient.auth.signUp({
        email,
        password
    })

    if (error) {
        const errorMessages = {
            'User already registered': 'Email đã tồn tại',
            'Password should be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự',
            'Unable to validate email address: invalid format': 'Email không hợp lệ',
            'Signup requires a valid password': 'Mật khẩu không hợp lệ'
        };

        const err = new Error(errorMessages[error.message] || error.message)
        err.status = 400
        throw err
    }

    return data
}

const signOut = async () => {
    const { error } = await supabase.supabaseClient.auth.signOut()

    if (error) {
        const err = new Error(error.message || 'Đăng xuất thất bại')
        err.status = 400
        throw err
    }
    return { success: true };
}

export const authService = {
    signInWithPassword, register, signOut
}