import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importUsersManagement = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có dữ liệu');
    }

    // Lấy tất cả domain codes
    const domainCodes = [
        ...new Set(
            rows
                .flatMap(r =>
                    r.domain_code
                        ?.split(',')
                        .map(d => d.trim())
                        .filter(Boolean) || []
                )
        )
    ];

    // Load domain map
    let domainMap = {};

    if (domainCodes.length) {
        const { data: domains, error } = await supabase
            .from('domain')
            .select('id, code')
            .in('code', domainCodes);

        if (error) throw error;

        domainMap = Object.fromEntries(
            domains.map(d => [d.code, d.id])
        );
    }

    const { data: roles, error } = await supabase
        .from('role')
        .select('id, code');

    if (error) throw error;

    const ROLE_MAP = Object.fromEntries(
        roles.map(r => [r.code, r.id])
    );

    // Xử lý từng user
    const results = [];

    for (const row of rows) {
        let userId = null;

        try {
            const { data, error } =
                await supabase.auth.admin.createUser({
                    email: row.email,
                    password: '12345678',
                    user_metadata: {
                        'phone': row.phone,
                        'full_name': row.full_name,
                        'image_url': row.image_url,
                    },
                    email_confirm: true,
                });

            if (error) throw error;

            userId = data.user.id;

            //  ROLE 
            const roleCode = row.role?.trim();
            const roleId = ROLE_MAP[roleCode];

            if (!roleId) {
                throw new Error(`Role không hợp lệ: ${roleCode}`);
            }

            const { error: roleError } = await supabase
                .from('user_role')
                .insert({
                    user_id: userId,
                    role_id: roleId
                });

            if (roleError) throw roleError;

            //  ADMIN 
            if (roleCode === 'admin') {
                results.push({ email: row.email, status: 'success' });
                continue;
            }

            //  DOMAIN 
            const codes = row.domain_code
                ?.split(',')
                .map(d => d.trim())
                .filter(Boolean) || [];

            if (!codes.length) {
                throw new Error('DomainOfficer phải có ít nhất 1 domain');
            }

            const missingDomains = codes.filter(c => !domainMap[c]);
            if (missingDomains.length) {
                throw new Error(`Domain không tồn tại: ${missingDomains.join(', ')}`);
            }

            const payload = codes.map(code => ({
                user_id: userId,
                domain_id: domainMap[code]
            }));

            const { error: domainError } = await supabase
                .from('officer_domain')
                .insert(payload);

            if (domainError) throw domainError;

            results.push({ email: row.email, status: 'success' });

        } catch (err) {

            // ROLLBACK AUTH USER
            if (userId) {
                await supabase.auth.admin.deleteUser(userId);
            }

            results.push({
                email: row.email,
                status: 'failed',
                error: err.message
            });
        }
    }

    return {
        total: rows.length,
        success: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        errors: results.filter(r => r.status === 'failed')
    };
};

