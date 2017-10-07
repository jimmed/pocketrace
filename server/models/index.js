const { DataTypes } = require('sequelize')
const { makeModels } = require('./utils')
const Player = require('./player')
const Round = require('./round')
const Division = require('./division')
const DivisionRanking = require('./divisionRanking')
const Match = require('./match')

const modelMakers = { Player, Round, Division, DivisionRanking, Match }

const setupModels = async (db, { log }) => {
    log.trace('Setting up models...')
    const models = makeModels(db, modelMakers)
    log.trace('Syncing database schema...')
    await db.sync()
    log.trace('Models set up!')
    return models
}

module.exports = { setupModels }
