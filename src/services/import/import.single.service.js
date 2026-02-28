import { IMPORT_TYPE } from './import.types.js';
import { batchUpsert } from '../shared/batch.upsert.service.js';
import { importCategoryGroupOnly } from './import.category.group.only.js';
import { importCategoryItemOnly } from './import.category.item.only.js';
import { importUsersManagement } from './import.users.management.js';

export const importSingleService = async (filePath, type) => {
    if (!type) {
        throw new Error('Import type is required');
    }

    switch (type) {
        case IMPORT_TYPE.DOMAIN:
            return await batchUpsert({
                filePath,
                table: 'domain',
                conflictKey: 'code',
            });

        case IMPORT_TYPE.CATEGORY_GROUP:
            return await importCategoryGroupOnly(filePath);

        case IMPORT_TYPE.CATEGORY_ITEM:
            return await importCategoryItemOnly(filePath);

        case IMPORT_TYPE.API_KEY:
            return await batchUpsert({
                filePath,
                table: 'api_key',
                conflictKey: 'system_name',
            });

        case IMPORT_TYPE.USERS_MANAGEMENT:
            return await importUsersManagement(filePath);

        default:
            throw new Error('Unsupported import type');
    }
};
