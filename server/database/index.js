const Sequelize = require('sequelize')

const setupDatabase = async (config, { log }) => {
    log.info('Setting up database...')
    const database = new Sequelize(config)
    log.trace('Authenticating...')
    await database.authenticate()
    log.trace('Syncing schema...')
    await database.sync({ force: true })
    log.info('Database ready!')
    return database
}

module.exports = { setupDatabase }
