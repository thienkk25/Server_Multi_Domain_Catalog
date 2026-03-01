import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importCategoryItemOnly = async (filePath, userId, role) => {
    let rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có dữ liệu');
    }

    // Trim dữ liệu
    rows = rows.map(r => ({
        code: r.code?.trim(),
        name: r.name?.trim(),
        description: r.description?.trim(),
        group_code: r.group_code?.trim()
    }));

    const groupCodes = [...new Set(rows.map(r => r.group_code).filter(Boolean))];

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
        filteredGroups.map(g => [
            g.code,
            { id: g.id, domain_id: g.domain_id }
        ])
    );

    const payload = rows.map(r => {
        if (!groupMap[r.group_code]) {
            throw new Error(`Nhóm không tồn tại hoặc không có quyền: ${r.group_code}`);
        }

        return {
            code: r.code,
            name: r.name,
            description: r.description,
            group_id: groupMap[r.group_code].id,
            domain_id: groupMap[r.group_code].domain_id
        };
    });

    const results = [];

    for (const row of payload) {

        if (role.code === 'admin') {

            try {
                const { domain_id, ...dataWithoutDomain } = row;

                const { error } = await supabase.rpc(
                    'admin_create_item',
                    {
                        p_data: dataWithoutDomain,
                        p_user_id: userId
                    }
                );

                if (error) throw error
                results.push({
                    code: row.code,
                    status: 'success'
                });
            } catch (error) {
                results.push({
                    code: row.code,
                    status: 'failed',
                    message: error.message
                });
            }

        } else if (role.code === 'domainOfficer') {

            try {
                const { error } = await supabase.rpc(
                    'do_create_category_item_version',
                    {
                        p_new_data: row,
                        p_user_id: userId
                    }
                );

                if (error) throw error
                results.push({
                    code: row.code,
                    status: 'success'
                });
            } catch (error) {
                results.push({
                    code: row.code,
                    status: 'failed',
                    message: error.message
                });
            }
        }


    }

    return {
        total: rows.length,
        success: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        errors: results.filter(r => r.status === 'failed')
    };
};