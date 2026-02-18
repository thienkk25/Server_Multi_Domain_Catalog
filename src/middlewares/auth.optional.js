import supabase from "../configs/supabase.js"

export const authOptional = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            req.user = null;
            return next();
        }

        const { data } = await supabase.auth.getUser(token);

        req.user = data?.user ?? null;

        next();
    } catch (err) {
        req.user = null;
        next();
    }
};
