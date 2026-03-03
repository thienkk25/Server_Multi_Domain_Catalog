import supabase from '../../configs/supabase.js';

/**
 * Export users management - format giống import (email, phone, full_name, role, domain_code)
 * Admin only. Không export password.
 */
export const exportUsersManagement = async () => {
    const { data: users, error } = await supabase
        .from('users')
        .select(`
            id,
            email,
            phone,
            full_name,
            user_role (
                role:role_id (code)
            ),
            officer_domain (
                domain:domain_id (code)
            )
        `);

    if (error) throw error;

    const list = users || [];

    return list.map((u) => {
        const roleCode = u.user_role?.[0]?.role?.code || '';
        const domainCodes = (u.officer_domain || [])
            .map((od) => od.domain?.code)
            .filter(Boolean);
        return {
            email: u.email || '',
            phone: u.phone || '',
            full_name: u.full_name || '',
            role: roleCode,
            domain_code: domainCodes.join(', ')
        };
    });
};
