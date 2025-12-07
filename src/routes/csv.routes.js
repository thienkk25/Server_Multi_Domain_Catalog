import { Router } from "express";
import multer from "multer";
import { importCsvController } from "../controllers/csv.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { checkRole } from "../middlewares/role.middleware.js"

const router = Router();
const upload = multer({ dest: "uploads/" }); // lưu file tạm

router.post("/import", authMiddleware, checkRole(['admin', 'domainOfficer']), upload.single("file"), importCsvController);

export default router;
