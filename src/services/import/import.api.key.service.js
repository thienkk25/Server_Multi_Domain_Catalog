import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importApiKey = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có dữ liệu');
    }

    const domainCodes = [
        ...new Set(
            rows.flatMap(r =>
                (r.allowed_domains || '')
                    .split(',')
                    .map(d => d.trim())
                    .filter(Boolean)
            )
        )
    ];

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

    const insertData = [];
    const results = [];

    for (const row of rows) {
        try {
            // Validate system_name
            if (!row.system_name?.trim()) {
                throw new Error('Thiếu system_name');
            }

            const systemName = row.system_name.trim();

            // Parse allowed domains
            const codes = [
                ...new Set(
                    (row.allowed_domains || '')
                        .split(',')
                        .map(d => d.trim())
                        .filter(Boolean)
                )
            ];

            // Check domain tồn tại
            const missingDomains = codes.filter(c => !domainMap[c]);
            if (missingDomains.length) {
                throw new Error(
                    `Domain không tồn tại: ${missingDomains.join(', ')}`
                );
            }

            insertData.push({
                system_name: systemName,
                allowed_domains: codes.length ? codes : null
            });

            results.push({
                systemName,
                status: 'pending'
            });

        } catch (err) {
            results.push({
                systemName: row.system_name || null,
                status: 'failed',
                error: err.message
            });
        }
    }

    if (insertData.length) {
        const { error } = await supabase
            .from('api_key')
            .upsert(insertData, {
                onConflict: 'system_name'
            });

        if (error) {
            // Nếu batch fail -> mark tất cả pending thành failed
            results.forEach(r => {
                if (r.status === 'pending') {
                    r.status = 'failed';
                    r.error = error.message;
                }
            });
        } else {
            // Mark thành success
            results.forEach(r => {
                if (r.status === 'pending') {
                    r.status = 'success';
                }
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