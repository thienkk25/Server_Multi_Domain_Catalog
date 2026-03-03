import supabase from '../../configs/supabase.js';
import { applyRoleFilter } from '../../utils/query.builder.js';

/**
 * Export category_item - format giống import (code, name, description, group_code)
 * Admin: full. domainOfficer/approver: theo domain được phân.
 */
export const exportCategoryItemOnly = async (role) => {
    let qb = supabase
        .from('category_item_view')
        .select(`
            id,
            code,
            name,
            description,
            group_id,
            domain_id,
            category_group:group_id (code)
        `)
        .eq('status', 'active');

    const result = applyRoleFilter(qb, role, 'domain_id');
    if (result.restricted) return [];

    const { data, error } = await result.qb;
    if (error) throw error;

    return (data || []).map((r) => ({
        code: r.code,
        name: r.name,
        description: r.description || '',
        group_code: r.category_group?.code || ''
    }));
};
