const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const matchModel = {
    name: 'match',
    fields: {
        state: DataTypes.ENUM('Scheduled', 'Started', 'Finished', 'Cancelled')
    },
    relate: ({ Match }) => {
        Match.hasOne(Match, { as: 'winner' })
        Match.hasOne(Match, { as: 'loser' })
    }
}

module.exports = asModel(matchModel)
