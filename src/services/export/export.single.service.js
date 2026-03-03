import { EXPORT_TYPE } from './export.types.js';
import { exportDomainOnly } from './export.domain.only.js';
import { exportCategoryGroupOnly } from './export.category.group.only.js';
import { exportCategoryItemOnly } from './export.category.item.only.js';
import { exportApiKey } from './export.api.key.js';
import { exportUsersManagement } from './export.users.management.js';

export const exportSingleService = async (type, role) => {
    if (!type) {
        throw new Error('Export type is required');
    }

    switch (Number(type)) {
        case EXPORT_TYPE.DOMAIN:
            if (role?.code !== 'admin') {
                throw new Error('Chỉ admin mới được export domain');
            }
            return await exportDomainOnly(role);

        case EXPORT_TYPE.CATEGORY_GROUP:
            return await exportCategoryGroupOnly(role);

        case EXPORT_TYPE.CATEGORY_ITEM:
            return await exportCategoryItemOnly(role);

        case EXPORT_TYPE.API_KEY:
            if (role?.code !== 'admin') {
                throw new Error('Chỉ admin mới được export API key');
            }
            return await exportApiKey();

        case EXPORT_TYPE.USERS_MANAGEMENT:
            if (role?.code !== 'admin') {
                throw new Error('Chỉ admin mới được export users management');
            }
            return await exportUsersManagement();

        default:
            throw new Error('Unsupported export type');
    }
};
