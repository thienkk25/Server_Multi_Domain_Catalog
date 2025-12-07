import { Router } from 'express'
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import domainRoutes from './domain.routes.js'
import categoryGroupRoutes from './category.group.routes.js'
import categoryItemRoutes from './category.item.routes.js'
import categoryItemVersionRoutes from './category.item.version.routes.js'
import categoryItemLegalRefRoutes from './category.item.legal.ref.routes.js'
import activityLogRoutes from './activity.log.routes.js'
import apiKeyRoutes from './api.key.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/domain', domainRoutes)
router.use('/category-group', categoryGroupRoutes)
router.use('/category-item', categoryItemRoutes)
router.use('/category-item-version', categoryItemVersionRoutes)
router.use('/category-item-legal-ref', categoryItemLegalRefRoutes)


router.use('/api-key', apiKeyRoutes)
router.use('/activity-log', activityLogRoutes)

export default router
