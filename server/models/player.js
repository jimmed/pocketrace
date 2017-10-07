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
    relate: ({ Player, Divison, DivisionRanking }) => {
        Player.belongsToMany(Division, { through: DivisionRanking })
    },
    staticMethods: ({ Player }) => ({
        async register({ name }) {
            return await Player.create({ name })
        }
    }),
    instanceMethods: ({ Player }) => ({
        async giveAdmin({ Player }) {
            return await this.update({ isAdmin: true })
        },
        async removeAdmin({ Player }) {
            return await this.update({ isAdmin: false })
        }
    })
}

module.exports = asModel(playerModel)
