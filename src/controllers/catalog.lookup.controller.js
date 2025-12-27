import { catalogLookupService } from '../services/catalog.lookup.service.js'

const getDomainsRef = async (req, res, next) => {
    try {
        const result = await catalogLookupService.getDomainsRef()
        res.json(
            {
                success: true,
                data: result
            })
    } catch (error) {
        next(error)
    }
}

const getCategoryGroupsRef = async (req, res, next) => {
    try {
        const result = await catalogLookupService.getCategoryGroupsRef(req.params.id)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const searchFlat = async (req, res, next) => {
    try {
        const result = await catalogLookupService.searchFlat(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const catalogLookupController = {
    getDomainsRef, getCategoryGroupsRef, searchFlat
}