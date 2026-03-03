import supabase from '../../configs/supabase.js';

/**
 * Export full catalog - format giống import.catalog
 * domain_code, domain_name, domain_description, group_code, group_name, group_description, item_code, item_name, item_description
 * Admin only.
 */
export const exportCatalogService = async () => {
    const { data: items, error } = await supabase
        .from('category_item_view')
        .select(`
            code,
            name,
            description,
            domain:domain_id (
                code,
                name,
                description
            ),
            category_group:group_id (
                code,
                name,
                description
            )
        `)
        .eq('status', 'active');

    if (error) throw error;

    return (items || []).map((item) => ({
        domain_code: item.domain?.code || '',
        domain_name: item.domain?.name || '',
        domain_description: item.domain?.description || '',
        group_code: item.category_group?.code || '',
        group_name: item.category_group?.name || '',
        group_description: item.category_group?.description || '',
        item_code: item.code || '',
        item_name: item.name || '',
        item_description: item.description || ''
    }));
};
