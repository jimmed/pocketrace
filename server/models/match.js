const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const matchModel = {
    name: 'match',
    fields: {
        state: {
            type: DataTypes.ENUM(
                'Scheduled',
                'Started',
                'Finished',
                'Cancelled'
            ),
            allowNull: false,
            defaultValue: 'Scheduled'
        }
    },
    relate: ({ Match }) => {
        Match.hasOne(Match, { as: 'winner' })
        Match.hasOne(Match, { as: 'loser' })
    }
}

module.exports = asModel(matchModel)
