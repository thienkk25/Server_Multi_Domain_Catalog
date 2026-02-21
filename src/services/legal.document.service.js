import supabase from '../configs/supabase.js'
import path from 'path'
import {
    applySearch,
    applyFilters,
    applySort
} from '../utils/query.builder.js'

const getAll = async (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit
    let countQb = supabase
        .from('public_legal_document')
        .select("id", { count: "exact", head: true })

    countQb = applySearch(countQb, query.search, ["code", "title", "issued_by_name", "file_name"])
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
        .from('public_legal_document')
        .select("*")

    dataQb = applySearch(dataQb, query.search, ["code", "title", "issued_by_name", "file_name"])
    dataQb = applyFilters(dataQb, query.filter)
    dataQb = applySort(dataQb, query, ["created_at", "updated_at", "code", "status", "title", "type"])

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

    let qb = supabase
        .from('public_legal_document')
        .select('*')
        .eq('id', id)

    const { data, error } = await qb.single()

    if (error) {
        if (error.code === 'PGRST116') {
            // Không tìm thấy hoặc không có quyền
            return null
        }
        throw new Error(error.message)
    }

    return data
}

const create = async (payload, file) => {
    let fileInfo = null

    if (file) {
        fileInfo = await uploadFile(file)
    }

    const { data, error } = await supabase
        .from('legal_document')
        .insert({
            ...payload,
            file_name: fileInfo?.file_name ?? file?.originalname ?? null,
            file_url: fileInfo?.public_url ?? null,
        })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            throw new Error('Mã hoặc tên tài liệu đã tồn tại')
        }
        throw error
    }
    return data
}

const update = async (id, payload, file) => {
    const { data: oldDoc, error: fetchError } = await supabase
        .from('legal_document')
        .select('file_name,file_url')
        .eq('id', id)
        .single()

    if (fetchError) throw fetchError

    let file_name = oldDoc.file_name
    let fileUrl = oldDoc.file_url
    let fileInfo = null

    if (file) {
        fileInfo = await uploadFile(file)
        file_name = fileInfo.file_name
        fileUrl = fileInfo.public_url
    }

    const cleanPayload = {
        ...payload,
        file_name: file_name,
        file_url: fileUrl

    }

    const { data, error } = await supabase
        .from('legal_document')
        .update(cleanPayload)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error

    if (fileInfo && oldDoc?.file_url != fileUrl) {
        await supabase.storage
            .from('legal_document_file')
            .remove([oldDoc.file_url.split('legal_document_file/').pop()])
    }

    return data
}



const remove = async (id) => {
    const { data: fileUrl } = await supabase
        .from('legal_document')
        .select('file_url')
        .eq('id', id)
        .single()

    if (fileUrl) {
        await supabase.storage
            .from('legal_document_file')
            .remove([fileUrl.file_url.split('legal_document_file/').pop()])
    }

    const { error } = await supabase
        .from('legal_document')
        .delete()
        .eq('id', id)

    if (error) throw error
}

const uploadFile = async (file) => {

    if (!file) throw new Error('File is required')

    const ext = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, ext)

    const safeName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/^-+|-+$/g, '')

    const storageKey = `${crypto.randomUUID()}-${safeName}${ext}`
    const fileName = Buffer
        .from(file.originalname, 'latin1')
        .toString('utf8');

    const storagePath = `files/${storageKey}`

    const { data, error } = await supabase.storage
        .from('legal_document_file')
        .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
        })

    if (error) throw error

    const link = supabase.storage
        .from('legal_document_file')
        .getPublicUrl(data.path);
    const publicUrl = link.data.publicUrl;

    return {
        file_path: data.path,
        file_name: fileName,
        mime_type: file.mimetype,
        file_size: file.size,
        public_url: publicUrl
    }
}

const getSignedUrl = async (filePath) => {
    const { data, error } = await supabase.storage
        .from('legal_document_file')
        .createSignedUrl(filePath, 60 * 5) // 5 phút

    if (error) throw error
    return data.signedUrl
}

const getLegalDocumentsWithFile = async (query) => {
    const page = Math.max(parseInt(query.page) || 1, 1)
    const limit = Math.min(parseInt(query.limit) || 20, 100)
    const offset = (page - 1) * limit

    // Khởi tạo query builder
    let qb = supabase
        .from('public_legal_document')
        .select('*', { count: "exact" })
        .not('file_name', 'is', null)
        .not('file_url', 'is', null)
        .eq('status', 'active');

    if (query.search) {
        const s = query.search;

        qb = qb.or(
            `code.ilike.%${s}%,title.ilike.%${s}%`
        )
    }


    const sortBy = query.sortBy || "created_at";
    const sortOrder = query.sort === "asc" ? true : false

    qb = qb.order(sortBy, { ascending: sortOrder })
    qb = qb.order("id", { ascending: true })

    qb = qb.range(offset, offset + limit - 1)

    const { data, error, count } = await qb

    if (error) throw error

    return {
        data,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
        },
    }
}


export const legalDocumentService = {
    getAll, getById, create, update, remove, getSignedUrl, getLegalDocumentsWithFile
}