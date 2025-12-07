import { importCsvService } from "../services/csv.service.js";

export const importCsvController = async (req, res) => {
    try {
        const filePath = req.file?.path;
        const { table } = req.body;

        if (!filePath) {
            return res.status(400).json({ error: "Không có file CSV" });
        }

        const result = await importCsvService(filePath, table);

        res.json({
            message: "Upsert CSV thành công!",
            rows: result.count,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
