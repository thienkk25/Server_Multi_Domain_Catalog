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
            .select("system_name,allowed_domains")
            .eq("key", apiKey)
            .eq("status", "active")
            .single()

        if (error || !data) {
            return res.status(401).json({
                success: false,
                message: "API Key không hợp lệ"
            })
        }

        const allowedDomainIds = Array.isArray(data.allowed_domains)
            ? data.allowed_domains.map(d => d.id)
            : []

        req.apiKey = {
            system_name: data.system_name,
            allowedDomainIds: allowedDomainIds
        }
        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Lỗi xác thực API Key"
        })
    }
}
