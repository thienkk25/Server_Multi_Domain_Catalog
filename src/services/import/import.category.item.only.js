import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importCategoryItemOnly = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    const groupCodes = [...new Set(rows.map(r => r.group_code))];

    if (!groupCodes.length) {
        throw new Error('File không có group_code');
    }

    const { data: categoryGroups, error } = await supabase
        .from('category_group')
        .select('id, group_code:code')
        .in('code', groupCodes);

    if (error) {
        throw new Error(error.message);
    }

    if (!categoryGroups || categoryGroups.length === 0) {
        throw new Error('Không tìm thấy nhóm tương ứng');
    }

    const domainMap = Object.fromEntries(
        categoryGroups.map(d => [d.group_code, d.id])
    );

    for (const row of rows) {
        if (!domainMap[row.group_code]) {
            throw new Error(`Nhóm không tồn tại: ${row.group_code}`);
        }
    }

    const payload = rows.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        group_id: domainMap[r.group_code],
    }));

    await supabase
        .from('category_item')
        .upsert(payload, { onConflict: 'code' });

    return { count: payload.length };
};

