const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const divisionModel = {
    name: 'division',
    fields: {
        name: { type: DataTypes.STRING, allowNull: false },
        order: { type: DataTypes.INTEGER, allowNull: false }
    },
    relate: ({ Division, DivisionRanking, Match, Player }) => {
        Division.belongsToMany(Player, { through: DivisionRanking })
        Division.hasMany(Match)
    }
}

module.exports = asModel(divisionModel)
