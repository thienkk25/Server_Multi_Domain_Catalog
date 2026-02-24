
export const applyRoleFilter = (qb, role, field) => {
    if (!field) {
        throw new Error("Role filter requires domain field")
    }

    if (!role) return { qb, restricted: false }

    if (role.code === "admin") {
        return { qb, restricted: false }
    }

    if (!Array.isArray(role.domains) || role.domains.length === 0) {
        return { qb, restricted: true }
    }

    return {
        qb: qb.in(field, role.domains),
        restricted: false
    }
}

export const applySearch = (qb, search, fields = []) => {
    if (!search || !fields.length) return qb

    const s = search.trim()

    const conditions = fields
        .map(f => `${f}.ilike.%${s}%`)
        .join(",")

    return qb.or(conditions)
}

export const applyFilters = (qb, filters = {}) => {
    for (const key in filters) {
        let value = filters[key];

        if (value == null) continue;

        // Nếu string rỗng → bỏ qua
        if (typeof value === "string") {
            value = value.trim();
            if (!value) continue;

            // Nếu có dấu phẩy → convert thành array
            if (value.includes(",")) {
                value = value.split(",").map(v => v.trim()).filter(Boolean);
            }
        }

        // Nếu là array
        if (Array.isArray(value)) {
            if (value.length === 0) continue;

            if (value.length === 1) {
                qb = qb.eq(key, value[0]); // chọn 1 → eq
            } else {
                qb = qb.in(key, value);    // nhiều → in
            }
            continue;
        }

        // Nếu là string đơn
        if (typeof value === "string") {
            qb = qb.eq(key, value);
        }
    }

    return qb;
};

export const applySort = (qb, query, allowedFields = []) => {
    const sortBy = allowedFields.includes(query.sortBy)
        ? query.sortBy
        : allowedFields[0]

    const ascending = query.sort === "asc"

    return qb
        .order(sortBy, { ascending })
        .order("id", { ascending: true })
}

export const emptyPagination = (page, limit) => ({
    data: [],
    pagination: {
        page,
        limit,
        total: 0,
        total_pages: 0,
        has_more: false
    }
})