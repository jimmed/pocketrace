const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const divisionModel = {
    name: 'division',
    fields: {
        name: DataTypes.STRING,
        order: DataTypes.INTEGER
    },
    relate: ({ Divison, DivisionRanking, Match, Player }) => {
        Division.belongsToMany(Player, { through: DivisionRanking })
        Division.hasMany(Match)
    }
}

module.exports = asModel(divisionModel)
