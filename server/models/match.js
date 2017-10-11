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
    relate: ({ Match, Player }) => {}
}

module.exports = asModel(matchModel)
