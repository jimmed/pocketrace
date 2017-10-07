const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const roundModel = {
    name: 'round',
    fields: {
        state: DataTypes.ENUM('NotStarted', 'Started', 'Finished'),
        startDate: DataTypes.DATEONLY,
        endDate: DataTypes.DATEONLY
    },
    relate: ({ Round, Divison }) => {
        Round.hasOne(Round, { as: 'previousRound' })
        Round.hasOne(Round, { as: 'nextRound' })
        Round.hasMany(Division)
    }
}

module.exports = asModel(roundModel)
