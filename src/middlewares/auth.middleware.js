import supabase from "../configs/supabase.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Thiếu Authorization header"
            })
        }

        const token = authHeader.split(" ")[1]

        const { data, error } = await supabase.auth.getUser(token)

        if (error || !data?.user) {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            })
        }

        req.user = data.user
        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lỗi xác thực"
        })
    }
}

