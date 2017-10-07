const { DataTypes } = require('sequelize')
const { asModel, asStateMachine } = require('./utils')

const matchModel = {
    name: 'match',
    fields: {
        state: asStateMachine({
            Scheduled: ['Started'],
            Started: ['Finished', 'Cancelled']
        })
    },
    relate: ({ Match, Player }) => {
        Match.hasOne(Player, { as: 'winner' })
        Match.hasOne(Player, { as: 'loser' })
    }
}

module.exports = asModel(matchModel)
