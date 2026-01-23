
export const importDomainOnly = (filePath) =>
    batchUpsert({ filePath, table: 'domains' });

export const importCategoryGroupOnly = (filePath) =>
    batchUpsert({ filePath, table: 'category_groups' });

export const importCategoryItemOnly = (filePath) =>
    batchUpsert({ filePath, table: 'category_items' });

export const importApiKey = (filePath) =>
    batchUpsert({ filePath, table: 'api_keys' });
