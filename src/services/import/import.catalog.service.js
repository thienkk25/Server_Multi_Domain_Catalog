import { parseFileToRows } from '../../utils/file.parser.js';
import { supabase } from '../../configs/supabase.js';

export const importCatalogService = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    const domains = [];
    const groups = [];
    const items = [];

    for (const row of rows) {
        if (row.domain_code) domains.push(row);
        if (row.group_code) groups.push(row);
        if (row.item_code) items.push(row);
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
