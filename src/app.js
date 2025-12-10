import express from 'express'
import cors from 'cors'
import router from './routes/index.js'
import { errorHandler } from "./middlewares/error.middleware.js"
import { swaggerDocument, swaggerUi } from './configs/swagger.config.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

if (swaggerDocument) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

app.use('/api/v1', router)

app.use(errorHandler)
export default app