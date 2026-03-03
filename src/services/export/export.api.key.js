import supabase from '../../configs/supabase.js';

/**
 * Export api_key - format giống import (system_name, allowed_domains)
 * Admin only.
 */
export const exportApiKey = async () => {
    const { data, error } = await supabase
        .from('api_key')
        .select(`
            id,
            system_name,
            allowed_domains
        `);

    if (error) throw error;

    const keys = data || [];
    if (!keys.length) return [];

    return keys.map((k) => {
        const codes = (k.allowed_domains || [])
            .map((d) => {
                if (typeof d === 'object' && d.code) return d.code;
                return null;
            })
            .filter(Boolean);

        return {
            system_name: k.system_name,
            allowed_domains: codes.join(', ')
        };
    });
};
