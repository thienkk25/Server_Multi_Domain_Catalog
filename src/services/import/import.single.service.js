import { parseFileToRows } from '../../utils/file.parser.js';
import { supabase } from '../../configs/supabase.js';

export const importSingleService = async (filePath, table) => {
    if (!table) {
        throw new Error('Invalid import table');
    }

    const rows = await parseFileToRows(filePath);

    await supabase.supabaseClient
        .from(table)
        .upsert(rows);

    return { inserted: rows.length };
};
