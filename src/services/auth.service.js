import supabase from '../configs/supabase.js'

const signInWithPassword = async ({ email, password }) => {
    if (!email || !password) {
        const err = new Error('Thiếu thông tin đăng nhập')
        err.status = 400
        throw err
    }

    const { data: userRow } = await supabase
        .from('users')
        .select('id, status')
        .eq('email', email)
        .maybeSingle()

    if (!userRow) {
        const err = new Error('Người dùng không tồn tại')
        err.status = 404
        throw err
    }

    if (userRow.status === 'inactive') {
        const err = new Error('Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên')
        err.status = 403
        throw err
    }

    const { data, error: authError } =
        await supabase.auth.signInWithPassword({
            email,
            password
        })

    if (authError) {
        const errorMessages = {
            'Invalid login credentials': 'Email hoặc mật khẩu không đúng',
            'Email not confirmed': 'Email chưa được xác thực',
            'User not found': 'Người dùng không tồn tại'
        }

        const err = new Error(errorMessages[authError.message] || authError.message)
        err.status = 401
        throw err
    }

    return data
}


const register = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
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
    const { error } = await supabase.auth.signOut()

    if (error) {
        const err = new Error(error.message || 'Đăng xuất thất bại')
        err.status = 400
        throw err
    }
    return { success: true }
}

const refreshToken = async ({ refresh_token }) => {
    const { data, error } =
        await supabase.auth.refreshSession({
            refresh_token,
        })

    if (error) {
        const err = new Error(
            error.message || 'Refresh token không hợp lệ hoặc đã hết hạn'
        )

        err.status = 401
        err.code = 'REFRESH_TOKEN_INVALID'

        throw err
    }

    return data
}


export const authService = {
    signInWithPassword, register, signOut, refreshToken
}