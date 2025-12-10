import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import yaml from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let swaggerDocument = null

try {
    const swaggerYaml = readFileSync(join(__dirname, '../../swagger.yaml'), 'utf8')

    swaggerDocument = yaml.parse(swaggerYaml)

} catch (error) {
    console.error('Error loading swagger.yaml:', error.message)
}

export { swaggerDocument, swaggerUi }

