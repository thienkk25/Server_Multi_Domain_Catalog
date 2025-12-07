import { Router } from 'express'
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import domainRoutes from './domain.routes.js'
import categoryGroupRoutes from './category.group.routes.js'
import categoryItemRoutes from './category.item.routes.js'
import categoryItemVersionRoutes from './category.item.version.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/domain', domainRoutes)
router.use('/category-group', categoryGroupRoutes)
router.use('/category-item', categoryItemRoutes)
router.use('/category-item-version', categoryItemVersionRoutes)

export default router
