// helpers/export.helper.js
import XLSX from 'xlsx';

/**
 * Convert JSON data to XLSX buffer
 */
export const buildXlsxBuffer = (data, sheetName = 'Data') => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx'
    });
};

/**
 * Convert JSON data to CSV string
 */
export const buildCsvString = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    return XLSX.utils.sheet_to_csv(worksheet);
};

/**
 * Set response headers for file download
 */
export const setDownloadHeaders = (res, filename, format) => {
    const mimeTypes = {
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        csv: 'text/csv'
    };

    res.setHeader('Content-Type', mimeTypes[format]);
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}.${format}`
    );
};