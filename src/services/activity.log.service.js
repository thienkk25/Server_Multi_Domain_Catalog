import supabase from "../configs/supabase.js"

const getAll = async (query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit
    const { count, error: countError } = await supabase
        .from("activity_log")
        .select("*", { count: "exact", head: true });

    if (countError) throw new Error(countError.message);

    const totalPages = Math.ceil((count || 0) / limit);

    if (page > totalPages && totalPages !== 0) {
        return {
            data: [],
            pagination: {
                page,
                limit,
                total: count,
                total_pages: totalPages,
                has_more: false
            }
        };
    }
    // Khởi tạo query builder
    let qb = supabase
        .from("activity_log")
        .select("*", { count: "exact" });

    if (query.search) {
        const s = query.search;

        qb = qb.or(
            `action.ilike.%${s}%,endpoint.ilike.%${s}%,method.ilike.%${s}%`
        )
    }

    if (query.filter) {
        for (const key in query.filter) {
            const value = query.filter[key];

            // Nếu là array → checkbox nhiều giá trị
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    qb = qb.in(key, value);
                }
            }

            // Nếu là chuỗi → filter 1 giá trị
            else if (typeof value === "string" && value.trim() !== "") {
                qb = qb.eq(key, value);
            }
        }
    }

    const sortBy = query.sortBy || "timestamp";
    const sortOrder = query.sort === "asc" ? true : false

    qb = qb.order(sortBy, { ascending: sortOrder })
    qb = qb.order("id", { ascending: true })

    qb = qb.range(offset, offset + limit - 1)

    const { data, error } = await qb

    if (error) throw error

    const hasMore = page * limit < count

    return {
        data,
        pagination: {
            page,
            limit,
            total: count,
            total_pages: totalPages,
            has_more: hasMore
        },
    }
}

const getById = async (id) => {
    const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw error

    return data
}

export const activityLogService = {
    getAll, getById
}