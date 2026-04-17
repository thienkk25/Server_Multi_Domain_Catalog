import { importSingleService } from '../services/import/import.single.service.js';
import { importCatalogService } from '../services/import/import.catalog.service.js';
import fs from 'fs';

export const importSingleController = async (req, res) => {
    const file = req.file;
    try {
        const { type } = req.body;
        const user = req.user;
        const role = req.role;

        const result = await importSingleService(file.path, Number(type), user, role);

        res.json({
            success: true,
            result,
        });
    } finally {
        // Luôn dọn dẹp file tạm ở thư mục tmp sau khi quá trình import kết thúc (bất kể thành công hay thất bại do lỗi)
        if (file && file.path && fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path).catch(() => {}); // Cố gắng xóa file và bỏ qua nếu không thể xóa
        }
    }
};

export const importCatalogController = async (req, res) => {
    const file = req.file;
    try {
        const user = req.user;
        const result = await importCatalogService(file.path, user);
        res.json({ success: true, result });
    } finally {
        // Luôn dọn dẹp file tạm ở thư mục tmp sau khi quá trình import kết thúc (bất kể thành công hay thất bại do lỗi)
        if (file && file.path && fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path).catch(() => {}); // Cố gắng xóa file và bỏ qua nếu không thể xóa
        }
    }
};
