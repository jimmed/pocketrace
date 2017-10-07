const { DataTypes } = require('sequelize')
const { asModel } = require('./utils')

const playerModel = {
    name: 'player',
    fields: {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        state: {
            type: DataTypes.ENUM('NotJoined', 'Joining', 'Joined', 'Leaving'),
            allowNull: false,
            defaultValue: 'NotJoined'
        }
    },
    relate: ({ Player, Divison, DivisionRanking }) => {
        Player.belongsToMany(Division, { through: DivisionRanking })
    }
}

module.exports = asModel(playerModel)
