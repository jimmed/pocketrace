const { GraphQLScalarType } = require('graphql')
const parseDate = require('date-fns/parse')

const dateTimeResolver = new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO8601 date string',
    parseValue: parseDate,
    serialize: value => value.toISOString(),
    parseLiteral(ast) {
        console.log(ast)
        switch (ast.kind) {
        // Implement your own behavior here by returning what suits your needs
        // depending on ast.kind
        }
    }
})

const resolvers = {
    Query: {
        async getPlayers(obj, args, { models: { Player } }) {
            return await Player.findAll()
        },
        async getPlayerByID(obj, { id }, { models: { Player } }) {
            return await Player.findById(id)
        }
    },
    DateTime: dateTimeResolver
}

module.exports = resolvers
