import { importSingleService } from '../services/import/import.single.service.js';
import { importCatalogService } from '../services/import/import.catalog.service.js';
import { IMPORT_TABLE_MAP } from '../services/import/import.registry.js';

export const importSingleController = async (req, res) => {
    const { type } = req.body;
    const file = req.file;

    const table = IMPORT_TABLE_MAP[type];

    if (!table) {
        return res.status(400).json({
            success: false,
            message: 'Invalid import type',
        });
    }

    const result = await importSingleService(file.path, table);

    res.json({
        success: true,
        result,
    });
};


export const importCatalogController = async (req, res) => {
    const file = req.file;
    const result = await importCatalogService(file.path);
    res.json({ success: true, result });
};
