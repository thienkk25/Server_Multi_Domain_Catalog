import { IMPORT_TYPE } from './import.types.js';
import { batchUpsert } from '../shared/batch.upsert.service.js';
import { importCategoryGroupOnly } from './import.category.group_only.js';
import { importCategoryItemOnly } from './import.category.item_only.js';
// import { importApiKey } from './import.api_key.js';

export const importSingleService = async (filePath, type) => {
    if (!type) {
        throw new Error('Invalid import type');
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

        // case IMPORT_TYPE.API_KEY:
        //     return await importApiKey(filePath);

        default:
            throw new Error('Unsupported import type');
    }
};
