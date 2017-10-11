const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const divisionRankingModel = {
    name: 'divisionRanking',
    fields: {
        points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        played: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        wins: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        losses: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        pocketDifference: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }
}

module.exports = asModel(divisionRankingModel)
