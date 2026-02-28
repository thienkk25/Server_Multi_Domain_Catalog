import supabase from '../../configs/supabase.js';
import { parseFileToRows } from '../../utils/file.parser.js';

export const importUsersManagement = async (filePath) => {
    const rows = await parseFileToRows(filePath);

    if (!rows.length) {
        throw new Error('File không có emails');
    }

    const results = await Promise.allSettled(
        rows.map(r =>
            supabase.auth.admin.createUser({
                email: r.email,
                password: '12345678',
                user_metadata: {
                    phone: r.phone,
                    full_name: r.full_name
                },
                email_confirm: true,
                phone_confirm: false,
            })
        )
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected');

    return {
        total: rows.length,
        success,
        failed: failed.length,
        errors: failed.map(f => f.reason?.message)
    };
};

