import { Router } from 'express';
import { checkRole } from '../middlewares/role.middleware.js';
import {
    exportSingleController,
    exportCatalogController
} from '../controllers/export.controller.js';

const router = Router();

// Export 1 bảng theo type (1=domain, 2=category_group, 3=category_item, 4=api_key, 5=users)
// GET /export/single?type=3&format=xlsx
router.get(
    '/single',
    checkRole(['admin', 'domainOfficer', 'approver']),
    exportSingleController
);

// Export domain + group + item chung (format catalog) - admin only
// GET /export/catalog?format=xlsx
router.get(
    '/catalog',
    checkRole(['admin']),
    exportCatalogController
);

export default router;
