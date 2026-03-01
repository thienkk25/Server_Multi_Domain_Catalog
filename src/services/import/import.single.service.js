import { IMPORT_TYPE } from './import.types.js';
import { batchUpsert } from '../shared/batch.upsert.service.js';
import { importCategoryGroupOnly } from './import.category.group.only.js';
import { importCategoryItemOnly } from './import.category.item.only.js';
import { importApiKey } from './import.api.key.service.js';
import { importUsersManagement } from './import.users.management.js';

export const importSingleService = async (filePath, type, user, role) => {
    if (!type) {
        throw new Error('Import type is required');
    }

    switch (type) {
        case IMPORT_TYPE.DOMAIN:
            if (role.code !== 'admin') {
                throw new Error('Only admin can import domain');
            }
            return await batchUpsert({
                filePath,
                table: 'domain',
                conflictKey: 'code',
            });

        case IMPORT_TYPE.CATEGORY_GROUP:
            return await importCategoryGroupOnly(filePath, role);

        case IMPORT_TYPE.CATEGORY_ITEM:
            return await importCategoryItemOnly(filePath, user.id, role);

        case IMPORT_TYPE.API_KEY:
            if (role.code !== 'admin') {
                throw new Error('Only admin can import API key');
            }
            return await importApiKey(filePath);

        case IMPORT_TYPE.USERS_MANAGEMENT:
            if (role.code !== 'admin') {
                throw new Error('Only admin can import users management');
            }
            return await importUsersManagement(filePath);

        default:
            throw new Error('Unsupported import type');
    }
};
