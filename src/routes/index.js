import { Router } from 'express'
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import authAdminRoutes from './auth.admin.routes.js'
import domainRoutes from './domain.routes.js'
import categoryGroupRoutes from './category.group.routes.js'
import categoryItemRoutes from './category.item.routes.js'
import legalDocumentRoutes from './legal.document.routes.js'
import categoryItemVersionRoutes from './category.item.version.routes.js'
import catalogLookupRoutes from './catalog.lookup.routes.js'
import activityLogRoutes from './activity.log.routes.js'
import apiKeyRoutes from './api.key.routes.js'
import importRoutes from "./import.route.js"
import { limiterMiddleware } from '../middlewares/limiter.middleware.js'

const router = Router()

router.use('/auth', authRoutes)

router.use(limiterMiddleware)

router.use('/admin/users', authAdminRoutes)

router.use('/user', userRoutes)
router.use('/domain', domainRoutes)
router.use('/category-group', categoryGroupRoutes)
router.use('/category-item', categoryItemRoutes)
router.use('/legal-document', legalDocumentRoutes)
router.use('/category-item-version', categoryItemVersionRoutes)
router.use('/catalog-lookup', catalogLookupRoutes)

router.use('/api-key', apiKeyRoutes)
router.use('/activity-log', activityLogRoutes)

router.use("/import", importRoutes);

export default router
