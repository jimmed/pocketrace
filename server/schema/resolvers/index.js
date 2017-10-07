const resolvers = {
    Query: {
        async getPlayers(obj, args, { models: { Player } }) {
            const result = await Player.findAll()
            return result
        }
    }
}

module.exports = resolvers
