const config = require('config')
const createLogger = require('driftwood')
const { setupDatabase } = require('./database')
const { setupModels } = require('./models')
const { setupHttp } = require('./http')

const log = createLogger('server')
const setupServer = async config => {
    createLogger.enable(config.log || {})
    log.info('Starting up!')
    const database = await setupDatabase(config.database, {
        log: log('database')
    })
    const models = await setupModels(database, { log: log('models') })
    const http = await setupHttp(models, config.http, { log: log('http') })
    log.info('Server started!')
    return { database, models, http }
}

if (module.parent) {
    module.exports = { setupServer }
} else {
    setupServer(config).catch(error => {
        log.error(error)
        process.exit(1)
    })
}
