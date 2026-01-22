import fs from 'fs';
import { parse } from 'csv-parse';
import { supabase } from '../../configs/supabase.js';

export const batchUpsert = async ({ filePath, table }) => {
    const batchSize = 1000;
    let batch = [];
    let total = 0;

    const parser = fs.createReadStream(filePath).pipe(
        parse({ columns: true, skip_empty_lines: true })
    );

    for await (const row of parser) {
        batch.push(row);

        if (batch.length >= batchSize) {
            await supabase.supabaseClient.from(table).upsert(batch);
            total += batch.length;
            batch = [];
        }
    }

    if (batch.length) {
        await supabase.supabaseClient.from(table).upsert(batch);
        total += batch.length;
    }

    return { inserted: total };
};
