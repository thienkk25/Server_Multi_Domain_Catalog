import supabase from "../configs/supabase.js"

export const checkRole = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Chưa xác thực người dùng"
                })
            }

            const userId = req.user.id

            // Query từ bảng users để join role + officer_domain
            const { data, error } = await supabase
                .from("users")
                .select(`
                    user_role(
                        role:role_id(code)
                    ),
                    officer_domain(domain_id)
                `)
                .eq("id", userId)
                .single()

            if (error) {
                console.error("CHECK ROLE ERROR:", error)
                return res.status(403).json({
                    success: false,
                    message: error.message || "Lỗi truy vấn phân quyền"
                })
            }

            if (!data) {
                return res.status(403).json({
                    success: false,
                    message: "Không tìm thấy người dùng trong hệ thống"
                })
            }
            // Lấy role code (giả định 1 user = 1 role)
            const roleCode = data.user_role?.[0]?.role?.code

            if (!roleCode) {
                return res.status(403).json({
                    success: false,
                    message: "Người dùng chưa được gán vai trò"
                })
            }

            // Kiểm tra role có được phép truy cập route không
            if (!allowedRoles.includes(roleCode)) {
                return res.status(403).json({
                    success: false,
                    message: `Bạn không có quyền thực hiện hành động này`
                })
            }

            // Lấy danh sách domain nếu không phải admin
            const officerDomains =
                roleCode === "admin"
                    ? []
                    : (data.officer_domain || []).map(d => d.domain_id)

            // Gắn vào request để service layer dùng
            req.role = {
                code: roleCode,
                domains: officerDomains
            }

            next()

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Lỗi kiểm tra phân quyền"
            })
        }
    }
}
