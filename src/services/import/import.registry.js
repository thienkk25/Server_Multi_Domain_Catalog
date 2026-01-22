import {
    importDomainOnly,
    importCategoryGroupOnly,
    importCategoryItemOnly,
    importApiKey,
} from './import.handlers.js';

export const IMPORT_TYPE = {
    DOMAIN: 1,
    CATEGORY_GROUP: 2,
    CATEGORY_ITEM: 3,
    API_KEY: 4,
};

export const IMPORT_REGISTRY = {
    [IMPORT_TYPE.DOMAIN]: importDomainOnly,
    [IMPORT_TYPE.CATEGORY_GROUP]: importCategoryGroupOnly,
    [IMPORT_TYPE.CATEGORY_ITEM]: importCategoryItemOnly,
    [IMPORT_TYPE.API_KEY]: importApiKey,
};
