import { importSingleService } from '../services/import/import.single.service.js';
import { importCatalogService } from '../services/import/import.catalog.service.js';

export const importSingleController = async (req, res) => {
    const { type } = req.body;
    const file = req.file;

    const user = req.user;

    const role = req.role;

    const result = await importSingleService(file.path, Number(type), user, role);

    res.json({
        success: true,
        result,
    });
};


export const importCatalogController = async (req, res) => {
    const file = req.file;
    const user = req.user;
    const result = await importCatalogService(file.path, user);
    res.json({ success: true, result });
};
