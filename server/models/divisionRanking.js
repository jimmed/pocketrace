const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const divisionRankingModel = {
    name: 'divisionRanking',
    fields: {
        points: DataTypes.INTEGER,
        played: DataTypes.INTEGER,
        wins: DataTypes.INTEGER,
        losses: DataTypes.INTEGER
    }
}

module.exports = asModel(divisionRankingModel)
