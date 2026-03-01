import { parseFileToRows } from '../../utils/file.parser.js';
import supabase from '../../configs/supabase.js';

export const importCatalogService = async (filePath, user) => {
    let rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có dữ liệu');
    }

    rows = rows.map(r => ({
        domain_code: r.domain_code?.trim(),
        domain_name: r.domain_name?.trim(),
        domain_description: r.domain_description?.trim(),

        group_code: r.group_code?.trim(),
        group_name: r.group_name?.trim(),
        group_description: r.group_description?.trim(),

        item_code: r.item_code?.trim(),
        item_name: r.item_name?.trim(),
        item_description: r.item_description?.trim()
    }));

    // UPSERT DOMAIN
    const domainPayload = [
        ...new Map(
            rows
                .filter(r => r.domain_code)
                .map(r => [
                    r.domain_code,
                    {
                        code: r.domain_code,
                        name: r.domain_name,
                        description: r.domain_description || null
                    }
                ])
        ).values()
    ];

    if (domainPayload.length) {
        const { error } = await supabase
            .from('domain')
            .upsert(domainPayload, { onConflict: 'code' });

        if (error) throw new Error(error.message);
    }

    // Load domain map theo code có trong file
    const domainCodes = domainPayload.map(d => d.code);

    const { data: domains, error: domainFetchError } = await supabase
        .from('domain')
        .select('id, code')
        .in('code', domainCodes);

    if (domainFetchError) throw new Error(domainFetchError.message);

    const domainMap = Object.fromEntries(
        (domains || []).map(d => [d.code, d.id])
    );

    // UPSERT GROUP
    const groupPayload = [
        ...new Map(
            rows
                .filter(r => r.group_code)
                .map(r => {
                    const domainId = domainMap[r.domain_code];

                    if (!domainId) {
                        throw new Error(`Domain không tồn tại: ${r.domain_code}`);
                    }

                    return [
                        r.group_code,
                        {
                            code: r.group_code,
                            name: r.group_name,
                            description: r.group_description || null,
                            domain_id: domainId
                        }
                    ];
                })
        ).values()
    ];

    if (groupPayload.length) {
        const { error } = await supabase
            .from('category_group')
            .upsert(groupPayload, { onConflict: 'code' });

        if (error) throw new Error(error.message);
    }

    // Load group map theo code có trong file
    const groupCodes = groupPayload.map(g => g.code);

    const { data: groups, error: groupFetchError } = await supabase
        .from('category_group')
        .select('id, code')
        .in('code', groupCodes);

    if (groupFetchError) throw new Error(groupFetchError.message);

    const groupMap = Object.fromEntries(
        (groups || []).map(g => [g.code, g.id])
    );

    // UPSERT ITEM
    const itemPayload = [
        ...new Map(
            rows
                .filter(r => r.item_code)
                .map(r => {
                    const groupId = groupMap[r.group_code];

                    if (!groupId) {
                        throw new Error(`Group không tồn tại: ${r.group_code}`);
                    }

                    return [
                        r.item_code,
                        {
                            code: r.item_code,
                            name: r.item_name,
                            description: r.item_description || null,
                            group_id: groupId,
                            created_by: user.id
                        }
                    ];
                })
        ).values()
    ];

    if (itemPayload.length) {
        const { error } = await supabase
            .from('category_item')
            .upsert(itemPayload, { onConflict: 'code' });

        if (error) throw new Error(error.message);
    }

    return {
        domains: domainPayload.length,
        groups: groupPayload.length,
        items: itemPayload.length
    };
};