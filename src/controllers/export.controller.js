import { exportSingleService } from '../services/export/export.single.service.js';
import { exportCatalogService } from '../services/export/export.catalog.service.js';
import {
    buildXlsxBuffer,
    buildCsvString,
    setDownloadHeaders
} from '../utils/export.helper.js';

export const exportSingleController = async (req, res) => {
    try {
        const { type, format = 'xlsx' } = req.query;
        const role = req.role;

        if (!type) {
            return res.status(400).json({ message: 'Thiếu tham số type' });
        }
        if (!['xlsx', 'csv'].includes(format)) {
            return res.status(400).json({ message: 'Format không hợp lệ (xlsx, csv)' });
        }

        const data = await exportSingleService(Number(type), role);

        const filename = `export-${type}`;
        setDownloadHeaders(res, filename, format);

        if (format === 'xlsx') {
            const buffer = buildXlsxBuffer(data);
            return res.send(buffer);
        }
        const csv = buildCsvString(data);
        return res.send(csv);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const exportCatalogController = async (req, res) => {
    try {
        const { format = 'xlsx' } = req.query;

        if (!['xlsx', 'csv'].includes(format)) {
            return res.status(400).json({ message: 'Format không hợp lệ (xlsx, csv)' });
        }

        const data = await exportCatalogService();

        setDownloadHeaders(res, 'export-catalog', format);

        if (format === 'xlsx') {
            const buffer = buildXlsxBuffer(data);
            return res.send(buffer);
        }
        const csv = buildCsvString(data);
        return res.send(csv);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
