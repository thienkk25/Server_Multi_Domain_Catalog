import supabase from '../../configs/supabase.js';
import { applyRoleFilter } from '../../utils/query.builder.js';

/**
 * Export category_group - format giống import (code, name, description, domain_code)
 * Admin: full. domainOfficer/approver: theo domain được phân.
 */
export const exportCategoryGroupOnly = async (role) => {
    let qb = supabase
        .from('category_group')
        .select(`
            id,
            code,
            name,
            description,
            domain:domain_id (code)
        `);

    const result = applyRoleFilter(qb, role, 'domain_id');
    if (result.restricted) return [];

    const { data, error } = await result.qb;
    if (error) throw error;

    return (data || []).map((r) => ({
        code: r.code,
        name: r.name,
        description: r.description || '',
        domain_code: r.domain?.code || ''
    }));
};
