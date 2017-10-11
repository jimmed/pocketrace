const path = require('path')
const { readFile } = require('mz/fs')
const { makeExecutableSchema } = require('graphql-tools')

const resolvers = require('./resolvers')
const types = path.join(__dirname, 'types.graphql')

const getSchema = async () => {
    const typeDefs = [
        await readFile(types, 'utf8'),
        `type Query {
            getPlayers: [Player]!
            getPlayerByID(id: ID!): Player
            getPlayersByState(states: [PlayerState]!): [Player]!
            getRounds: [Round]!
            getRoundByID(id: ID!): Round
            getRoundsByState(states: [RoundState]!): [Round]!
            getMatches: [Match]!
            getMatchByID(id: ID!): Match
            getMatchesByState(states: [MatchState]!): [Match]!
        }`
    ]
    return makeExecutableSchema({ typeDefs, resolvers })
}

module.exports = { getSchema }
