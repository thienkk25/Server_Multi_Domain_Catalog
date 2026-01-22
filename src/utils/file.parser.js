import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import XLSX from 'xlsx';

export const parseFileToRows = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.csv') {
        return parseCsv(filePath);
    }

    if (ext === '.xlsx') {
        return parseXlsx(filePath);
    }

    throw new Error('Unsupported file type');
};

const parseCsv = async (filePath) => {
    const rows = [];

    const parser = fs.createReadStream(filePath).pipe(
        parse({ columns: true, skip_empty_lines: true })
    );

    for await (const row of parser) {
        rows.push(row);
    }

    return rows;
};

const parseXlsx = async (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    return XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        { defval: null }
    );
};
