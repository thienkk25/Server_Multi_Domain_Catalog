import supabase from '../../configs/supabase.js';
import { applyRoleFilter } from '../../utils/query.builder.js';

/**
 * Export domain - format giống import (code, name, description)
 * Admin: full. domainOfficer/approver: theo domain được phân.
 */
export const exportDomainOnly = async (role) => {
    let qb = supabase
        .from('domain')
        .select('id, code, name, description');

    const result = applyRoleFilter(qb, role, 'id');
    if (result.restricted) return [];

    const { data, error } = await result.qb;
    if (error) throw error;

    return (data || []).map((r) => ({
        code: r.code,
        name: r.name,
        description: r.description || ''
    }));
};
