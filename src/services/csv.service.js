import fs from "fs";
import { parse } from "csv-parse";
import { supabase } from "../configs/supabase.js"

export const importCsvService = async (filePath, table) => {
    const batchSize = 1000; // tối ưu
    let batch = [];
    let totalInserted = 0;

    const parser = fs
        .createReadStream(filePath)
        .pipe(
            parse({
                columns: true,
                skip_empty_lines: true,
            })
        );

    // STREAM: đọc từng dòng trong CSV
    for await (const row of parser) {
        batch.push(row);

        // Khi đủ batch → upsert lên Supabase
        if (batch.length >= batchSize) {
            const { error } = await supabase.supabaseClient
                .from(table) // đổi tên bảng
                .upsert(batch, { onConflict: "id" }); // cột unique

            if (error) throw error;

            totalInserted += batch.length;
            console.log(`Imported ${totalInserted} dòng`);

            batch = []; // reset batch
        }
    }

    // Phần còn lại chưa push (nếu có)
    if (batch.length > 0) {
        const { error } = await supabase.supabaseClient
            .from(table)
            .upsert(batch, { onConflict: "id" });

        if (error) throw error;

        totalInserted += batch.length;
        console.log(`Imported ${totalInserted} dòng`);
    }

    // XÓA file CSV tạm
    // fs.unlink(filePath, () => { });

    return { count: totalInserted };
};
