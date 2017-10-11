const { DataTypes } = require('sequelize')
const { asModel, asStateMachine } = require('./utils')

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
        state: asStateMachine({
            NotJoined: ['Joining'],
            Joining: ['Joined', 'NotJoined'],
            Joined: ['Leaving'],
            Leaving: ['NotJoined']
        })
    },
    relate: ({ Player, Division, DivisionRanking, Match }) => {
        Player.belongsToMany(Division, { through: DivisionRanking })
        Player.hasMany(Match, { as: 'winner' })
        Player.hasMany(Match, { as: 'loser' })
    },
    staticMethods: ({ Player }) => ({
        async register({ name }) {
            return await Player.create({ name })
        }
    })
}

module.exports = asModel(playerModel)
