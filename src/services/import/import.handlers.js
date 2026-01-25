export const importDomainOnly = (filePath) =>
    parseFileToRows({ filePath, table: 'domains' });

export const importCategoryGroupOnly = (filePath) =>
    parseFileToRows({ filePath, table: 'category_groups' });

export const importCategoryItemOnly = (filePath) =>
    parseFileToRows({ filePath, table: 'category_items' });

export const importApiKey = (filePath) =>
    parseFileToRows({ filePath, table: 'api_keys' });
