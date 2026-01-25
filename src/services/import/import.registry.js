export const IMPORT_TYPE = {
    DOMAIN: 1,
    CATEGORY_GROUP: 2,
    CATEGORY_ITEM: 3,
    API_KEY: 4,
};

export const IMPORT_TABLE_MAP = {
    [IMPORT_TYPE.DOMAIN]: 'domain',
    [IMPORT_TYPE.CATEGORY_GROUP]: 'category_group',
    [IMPORT_TYPE.CATEGORY_ITEM]: 'category_item',
    [IMPORT_TYPE.API_KEY]: 'api_key',
};
