import { importCsvService } from "../services/csv.service.js";

export const importCsvController = async (req, res) => {
    try {
        const file = req.file;
        const { table } = req.body;

        if (!file) {
            return res.status(400).json({ error: "Không có file CSV" });
        }

        if (file.mimetype !== "text/csv") {
            return res.status(400).json({ error: "File không phải CSV" });
        }

        if (!file.originalname.toLowerCase().endsWith(".csv")) {
            return res.status(400).json({ error: "File phải có đuôi .csv" });
        }

        const result = await importCsvService(file.path, table);

        res.json({
            message: "Upsert CSV thành công!",
            rows: result.count,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
