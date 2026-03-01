import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importApiKey = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có dữ liệu');
    }

    // Lấy tất cả domain codes
    const domainCodes = [
        ...new Set(
            rows
                .flatMap(r =>
                    r.allowed_domains
                        ?.split(',')
                        .map(d => d.trim())
                        .filter(Boolean) || []
                )
        )
    ];

    // Load domain map
    let domainMap = {};

    if (domainCodes.length) {
        const { data: domains, error } = await supabase
            .from('domain')
            .select('id, code')
            .in('code', domainCodes);

        if (error) throw error;

        domainMap = Object.fromEntries(
            domains.map(d => [d.code, d.id])
        );
    }

    const results = [];

    for (const row of rows) {
        try {

            const codes = [... new Set(row.allowed_domains?.split(',')
                .map(d => d.trim())
                .filter(Boolean) || [])];

            const missingDomains = codes.filter(c => !domainMap[c]);
            if (missingDomains.length) {
                throw new Error(`Domain không tồn tại: ${missingDomains.join(', ')}`);
            }

            const { error } = await supabase
                .from('api_key')
                .insert({
                    system_name: row.system_name,
                    allowed_domains: codes
                });

            if (error) throw error;

            results.push({ systemName: row.system_name, status: 'success' });

        } catch (err) {
            results.push({
                systemName: row.system_name,
                status: 'failed',
                error: err.message
            });
        }
    }

    return {
        total: rows.length,
        success: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        errors: results.filter(r => r.status === 'failed')
    };

};
