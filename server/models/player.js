const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const playerModel = {
    name: 'player',
    fields: {
        isAdmin: DataTypes.BOOLEAN,
        state: DataTypes.ENUM('NotJoined', 'Joining', 'Joined', 'Leaving')
    },
    relate: ({ Player, Divison, DivisionRanking }) => {
        Player.belongsToMany(Division, { through: DivisionRanking })
    }
}

module.exports = asModel(playerModel)
