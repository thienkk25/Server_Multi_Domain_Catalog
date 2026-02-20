import supabase from "../configs/supabase.js"

export const apiKeyMiddleware = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key']

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "Thiếu API Key"
            })
        }

        const { data, error } = await supabase
            .from("api_key")
            .select("*")
            .eq("key", apiKey)
            .eq("status", "active")
            .single()

        if (error || !data) {
            return res.status(401).json({
                success: false,
                message: "API Key không hợp lệ"
            })
        }

        req.apiKey = data
        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lỗi xác thực API Key"
        })
    }
}
