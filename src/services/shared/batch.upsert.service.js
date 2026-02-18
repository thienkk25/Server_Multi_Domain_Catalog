import { parseFileToRows } from '../../utils/file.parser.js';
import supabase from '../../configs/supabase.js';

export const batchUpsert = async ({ filePath, table, conflictKey }) => {
    const rows = await parseFileToRows(filePath);

    await supabase
        .from(table)
        .upsert(rows, conflictKey ? { onConflict: conflictKey } : undefined);

    return { count: rows.length };
};
