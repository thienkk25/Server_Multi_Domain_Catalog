import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importCategoryGroupOnly = async (filePath, role) => {
    let rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có dữ liệu');
    }

    // Trim dữ liệu
    rows = rows.map(r => ({
        ...r,
        code: r.code?.trim(),
        name: r.name?.trim(),
        description: r.description?.trim(),
        domain_code: r.domain_code?.trim()
    }));

    // Filter theo quyền
    if (role.code === 'domainOfficer') {
        const allowedSet = new Set(role.domains);
        rows = rows.filter(r => allowedSet.has(r.domain_code));

        if (!rows.length) {
            throw new Error('Không có lĩnh vực hợp lệ theo quyền của bạn');
        }
    }

    const domainCodes = [...new Set(rows.map(r => r.domain_code))];

    const { data: domains, error } = await supabase
        .from('domain')
        .select('id, code')
        .in('code', domainCodes);

    if (error) throw new Error(error.message);

    if (!domains?.length) {
        throw new Error('Không tìm thấy lĩnh vực tương ứng');
    }

    const domainMap = Object.fromEntries(
        domains.map(d => [d.code, d.id])
    );

    // Validate domain tồn tại
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

    const { error: upsertError } = await supabase
        .from('category_group')
        .upsert(payload, { onConflict: 'code' });

    if (upsertError) {
        throw new Error(upsertError.message);
    }

    return { count: payload.length };
};

