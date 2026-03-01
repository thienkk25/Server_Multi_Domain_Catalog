import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importCategoryItemOnly = async (filePath, userId, role) => {
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
        group_code: r.group_code?.trim()
    }));

    const groupCodes = [...new Set(rows.map(r => r.group_code))];

    if (!groupCodes.length) {
        throw new Error('File không có group_code');
    }

    const { data: categoryGroups, error } = await supabase
        .from('category_group')
        .select('id, code, domain_id')
        .in('code', groupCodes);

    if (error) throw new Error(error.message);

    if (!categoryGroups?.length) {
        throw new Error('Không tìm thấy nhóm tương ứng');
    }

    // Filter theo quyền domainOfficer
    let filteredGroups = categoryGroups;

    if (role.code === 'domainOfficer') {
        const allowedDomainSet = new Set(role.domains);

        filteredGroups = categoryGroups.filter(g =>
            allowedDomainSet.has(g.domain_id)
        );

        if (!filteredGroups.length) {
            throw new Error('Bạn không có quyền import nhóm này');
        }
    }

    const groupMap = Object.fromEntries(
        filteredGroups.map(g => [g.code, g.id])
    );

    for (const row of rows) {
        if (!groupMap[row.group_code]) {
            throw new Error(`Nhóm không tồn tại hoặc không có quyền: ${row.group_code}`);
        }
    }

    const payload = rows.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        group_id: groupMap[r.group_code],
    }));

    if (role.code === 'admin') {
        const { error: upsertError } = await supabase
            .from('category_item')
            .upsert(payload, { onConflict: 'code' });

        if (upsertError) {
            throw new Error(upsertError.message);
        }
    } else if (role.code === 'domainOfficer') {

        for (const row of payload) {

            const { error: rpcError } = await supabase
                .rpc('do_create_category_item_version', {
                    p_new_data: row,
                    p_user_id: userId
                });

            if (rpcError) {
                throw new Error(
                    `Lỗi khi tạo version cho item ${row.code}: ${rpcError.message}`
                );
            }
        }
    }

    return { count: payload.length };
};

