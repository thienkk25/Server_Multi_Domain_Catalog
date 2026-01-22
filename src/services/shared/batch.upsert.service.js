import fs from 'fs';
import { parse } from 'csv-parse';
import XLSX from 'xlsx';

export const parseCsv = async (filePath) => {
    const rows = [];
    const parser = fs.createReadStream(filePath).pipe(
        parse({ columns: true, skip_empty_lines: true })
    );

    for await (const row of parser) rows.push(row);
    return rows;
};

export const parseXlsx = async (filePath) => {
    const workbook = XLSX.readFile(filePath);
    return XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { defval: null }
    );
};

export const parseFileToRows = async (filePath) => {
    if (filePath.endsWith('.csv')) return parseCsv(filePath);
    if (filePath.endsWith('.xlsx')) return parseXlsx(filePath);
    throw new Error('Unsupported file type');
};
