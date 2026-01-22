import fs from 'fs';
import { parse } from 'csv-parse';

export const parseCatalogCsv = async (filePath) => {
    const domains = [];
    const groups = [];
    const items = [];

    const parser = fs.createReadStream(filePath).pipe(
        parse({ columns: true, skip_empty_lines: true })
    );

    for await (const row of parser) {
        if (row.domain_code) domains.push(row);
        if (row.group_code) groups.push(row);
        if (row.item_code) items.push(row);
    }

    return { domains, groups, items };
};
