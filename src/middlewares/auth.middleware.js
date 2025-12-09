import { supabase } from "../configs/supabase.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key']

        // Nếu có API KEY → check trong bảng api_key
        if (apiKey) {
            const { data: keys, error } = await supabase.supabaseSuperAdmin
                .from("api_key")
                .select("*")
                .eq("key", apiKey)
                .eq("status", "active")
                .single()

            if (error || !keys) {
                return res.status(401).json({
                    success: false,
                    message: "API Key không hợp lệ hoặc bị thu hồi"
                })
            }

            req.apiKey = keys // lưu info api key
            return next()
        }

        // ---- Nếu KHÔNG có API KEY thì check Bearer Token ----

        const authHeader = req.headers.authorization;
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

        const { data, error } = await supabase.supabaseClient.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ hoặc hết hạn"
            })
        }

        req.user = data.user
        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lỗi xác thực",
            error: err.message
        })
    }
}
