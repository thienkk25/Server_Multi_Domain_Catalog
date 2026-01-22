import { parseFileToRows } from './file.parser.js';

export const parseCatalogRows = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    const domains = [];
    const groups = [];
    const items = [];

    for (const row of rows) {
        if (row.domain_code) domains.push(row);
        if (row.group_code) groups.push(row);
        if (row.item_code) items.push(row);
    }

    return { domains, groups, items };
};
