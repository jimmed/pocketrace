const Sequelize = require('sequelize')

const setupDatabase = async (config, { log }) => {
    log.info('Setting up database...')
    const database = new Sequelize(config)
    log.trace('Authenticating...')
    await database.authenticate()
    log.info('Database ready!')
    return database
}

module.exports = { setupDatabase }
