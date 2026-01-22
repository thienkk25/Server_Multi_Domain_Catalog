import { IMPORT_REGISTRY } from './import.registry.js';

export const importSingleService = async (filePath, type) => {
    const handler = IMPORT_REGISTRY[type];
    if (!handler) {
        throw new Error('Invalid import type');
    }

    return handler(filePath);
};
