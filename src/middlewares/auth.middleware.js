import { supabase } from "../configs/supabase.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Thiếu header xác thực (Authorization)"
            })
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            })
        }

        // Xác thực token qua Supabase
        const { data, error } = await supabase.supabaseClient.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn"
            })
        }

        // Lưu user để các controller phía sau dùng
        req.user = data.user

        next()

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Không có quyền truy cập"
        })
    }
}
