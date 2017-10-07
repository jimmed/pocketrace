const path = require('path')
const { readFile } = require('mz/fs')
const { makeExecutableSchema } = require('graphql-tools')

const types = path.join(__dirname, 'types.graphql')

const getSchema = async () => {
    const typeDefs = [
        await readFile(types, 'utf8'),
        `type Query {
            getPlayers: [Player]!
            getRounds: [Round]!
        }`
    ]
    return makeExecutableSchema({
        typeDefs
    })
}

module.exports = { getSchema }
