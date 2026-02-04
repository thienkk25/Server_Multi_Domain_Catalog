import { supabase } from '../configs/supabase.js'

const getAll = async (query) => {
    const page = parseInt(query.page) < 0 ? 1 : parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit

    // Khởi tạo query builder
    let qb = supabase.supabaseClient
        .from("domain")
        .select("*", { count: "exact" });

    if (query.search) {
        const s = query.search;

        qb = qb.or(
            `code.ilike.%${s}%,name.ilike.%${s}%`
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

    const sortBy = query.sortBy || "created_at";
    const sortOrder = query.sort === "asc" ? true : false

    qb = qb.order(sortBy, { ascending: sortOrder })
    qb = qb.order("id", { ascending: true })

    qb = qb.range(offset, offset + limit - 1)

    const { data, error, count } = await qb

    if (error) throw error

    const totalPages = Math.ceil(count / limit)

    const hasMore = page * limit < count

    if (page > totalPages && totalPages !== 0) {
        return {
            data: [],
            pagination: {
                page,
                limit,
                total: count,
                total_pages: totalPages,
                has_more: hasMore
            },
        }
    }


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
    const { data: domain, error } = await supabase.supabaseClient
        .from('domain')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return domain
}

const create = async (payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .insert(payload)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            throw new Error('Mã hoặc tên domain đã tồn tại')
        }
        throw error
    }
    return data
}

const update = async (id, payload) => {
    const { data, error } = await supabase.supabaseClient
        .from('domain')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

const remove = async (id) => {
    const { error } = await supabase.supabaseClient
        .from('domain')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export const domainService = {
    getAll, getById, create, update, remove
}