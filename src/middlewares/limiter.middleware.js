import rateLimit from "express-rate-limit"
import { supabase } from "../configs/supabase.js"

export const limiterMiddleware = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Quá nhiều yêu cầu. Vui lòng thử lại sau."
    },
    skip: async (req) => {
        const apiKey = req.headers['x-api-key']

        if (apiKey) {
            const { data: keys, error } = await supabase.supabaseSuperAdmin
                .from("api_key")
                .select("*")
                .eq("key", apiKey)
                .eq("status", "active")
                .single()

            if (error || !keys) {
                return false
            }
            return true
        }

        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            if (!token) {
                return false
            }

            const { data, error } = await supabase.supabaseClient.auth.getUser(token);

            if (error || !data?.user) {
                return false
            }

            return true
        }

        return false
    }
})
