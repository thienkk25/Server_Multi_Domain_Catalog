import { parseCatalogCsv } from '../../utils/csv.parser.js';
import { supabase } from '../../configs/supabase.js';

export const importCatalogService = async (filePath) => {
    const { domains, groups, items } = await parseCatalogCsv(filePath);

    if (items.length && !groups.length) {
        throw new Error('Item tồn tại nhưng không có group');
    }

    if (domains.length) {
        await supabase.supabaseClient.from('domains').upsert(domains);
    }

    if (groups.length) {
        await supabase.supabaseClient.from('category_groups').upsert(groups);
    }

    if (items.length) {
        await supabase.supabaseClient.from('category_items').upsert(items);
    }

    return {
        domains: domains.length,
        groups: groups.length,
        items: items.length,
    };
};
