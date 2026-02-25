import supabase from "../configs/supabase.js"
import {
    applySearch,
    applyFilters,
    applySort
} from '../utils/query.builder.js'

const TABLE_NAME = "activity_log"

const getAll = async (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from(TABLE_NAME)
        .select("id", { count: "exact", head: true })

    countQb = applySearch(countQb, query.search, ["method", "action", "timestamp"])
    countQb = applyFilters(countQb, query.filter)

    const { count, error: countError } = await countQb
    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    if (page > totalPages && totalPages !== 0) {
        return {
            data: [],
            pagination: {
                page,
                limit,
                total,
                total_pages: totalPages,
                has_more: false
            }
        }
    }

    let dataQb = supabase
        .from(TABLE_NAME)
        .select("*")

    dataQb = applySearch(dataQb, query.search, ["method", "action"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(dataQb, query, ["timestamp", 'action', 'method'])

    const { data, error } = await dataQb
        .range(offset, offset + limit - 1)

    if (error) throw error

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            total_pages: totalPages,
            has_more: page < totalPages
        }
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