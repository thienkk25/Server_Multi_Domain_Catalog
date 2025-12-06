import { supabase } from "../configs/supabase.js"

export const checkRole = (roles = []) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            // Lấy role của user từ bảng user_role
            const { data: userRole, error } = await supabase.supabaseSuperAdmin
                .from("user_role")
                .select("role:role_id(code)")
                .eq("user_id", userId)
                .single();

            if (error || !userRole) {
                return res.status(403).json({
                    success: false,
                    message: "Không lấy được vai trò người dùng"
                });
            }

            const roleCode = userRole.role.code;

            // Nếu route yêu cầu role mà user không có ⇒ chặn
            if (!roles.includes(roleCode)) {
                return res.status(403).json({
                    success: false,
                    message: `Bạn không có quyền thực hiện hành động này (cần quyền: ${roles.join(", ")})`
                });
            }

            // Gắn role vào request
            req.role = roleCode;

            next();

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập"
            });
        }
    }
}
