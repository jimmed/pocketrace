const { DataTypes, NOW } = require('sequelize')
const { asModel, asStateMachine } = require('./utils')

const roundModel = {
    name: 'round',
    fields: {
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state: asStateMachine({
            NotStarted: ['Started'],
            Started: ['Finished'],
            Finished: []
        })
    },
    relate: ({ Round, Divison }) => {
        Round.hasOne(Round, { as: 'previousRound' })
        Round.hasOne(Round, { as: 'nextRound' })
        Round.hasMany(Division)
    }
}

module.exports = asModel(roundModel)
