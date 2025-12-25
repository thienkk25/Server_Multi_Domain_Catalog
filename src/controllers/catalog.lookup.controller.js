import { catalogLookupService } from '../services/catalog.lookup.service.js'

const getDomains = async (req, res, next) => {
    try {
        const result = await catalogLookupService.getDomains()
        res.json(
            {
                success: true,
                data: result
            })
    } catch (error) {
        next(error)
    }
}

const getCategoryGroups = async (req, res, next) => {
    try {
        const result = await catalogLookupService.getCategoryGroups(req.params.id)
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
    getDomains, getCategoryGroups, searchFlat
}