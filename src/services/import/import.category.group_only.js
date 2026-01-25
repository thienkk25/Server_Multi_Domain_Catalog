import { supabase } from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importCategoryGroupOnly = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    const domainCodes = [...new Set(rows.map(r => r.domain_code))];

    if (!domainCodes.length) {
        throw new Error('File không có domain_code');
    }

    const { data: domains, error } = await supabase.supabaseClient
        .from('domain')
        .select('id, domain_code:code')
        .in('code', domainCodes);

    if (error) {
        throw new Error(error.message);
    }

    if (!domains || domains.length === 0) {
        throw new Error('Không tìm thấy lĩnh vực tương ứng');
    }

    const domainMap = Object.fromEntries(
        domains.map(d => [d.domain_code, d.id])
    );

    for (const row of rows) {
        if (!domainMap[row.domain_code]) {
            throw new Error(`Lĩnh vực không tồn tại: ${row.domain_code}`);
        }
    }

    const payload = rows.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        domain_id: domainMap[r.domain_code],
    }));

    await supabase.supabaseClient
        .from('category_group')
        .upsert(payload, { onConflict: 'code' });

    return { count: payload.length };
};

