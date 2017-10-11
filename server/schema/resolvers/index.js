const { GraphQLScalarType } = require('graphql')
const parseDate = require('date-fns/parse')
const { Op } = require('sequelize')

const dateTimeResolver = new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO8601 date string',
    parseValue: parseDate,
    serialize: value => parseDate(value).toISOString(),
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
        async getPlayers(root, args, { models: { Player } }) {
            return await Player.findAll()
        },
        async getPlayerByID(root, { id }, { models: { Player } }) {
            return await Player.findById(id)
        },
        async getPlayersByState(root, { states = [] }, { models: { Player } }) {
            return await Player.findAll({
                where: { state: { [Op.in]: states } }
            })
        },
        async getRounds(root, args, { models: { Round } }) {
            return await Round.findAll()
        },
        async getRoundByID(root, { id }, { models: { Round } }) {
            return await Round.findById(id)
        },
        async getRoundsByState(root, { states = [] }, { models: { Round } }) {
            return await Round.findAll({
                where: { state: { [Op.in]: states } }
            })
        },
        async getMatches(root, args, { models: { Match } }) {
            return await Match.findAll()
        },
        async getRoundByID(root, { id }, { models: { Match } }) {
            return await Match.findById(id)
        },
        async getMatchesByState(root, { states = [] }, { models: { Match } }) {
            return await Match.findAll({
                where: { state: { [Op.in]: states } }
            })
        }
    },
    Player: {
        async divisionRankings({ id }, args, { models: { Player, Division } }) {
            const { divisions } = await Player.findById(id, {
                include: [
                    {
                        model: Division,
                        through: {
                            attributes: [
                                'points',
                                'played',
                                'wins',
                                'losses',
                                'pocketDifference'
                            ]
                        }
                    }
                ]
            })

            return divisions
                .map(division => division.toJSON())
                .map(({ divisionRanking, ...rest }) => ({
                    ...divisionRanking,
                    division: rest
                }))
        }
    },
    Division: {
        async rankings({ id }, args, { models: { Division, Player } }) {
            const { players } = await Division.findById(id, {
                include: [
                    {
                        model: Player,
                        through: {
                            attributes: [
                                'points',
                                'played',
                                'wins',
                                'losses',
                                'pocketDifference'
                            ]
                        }
                    }
                ]
            })

            return players
                .map(player => player.toJSON())
                .map(({ divisionRanking, ...rest }) => ({
                    ...divisionRanking,
                    player: rest
                }))
        },
        async matches({ id }, args, { models: { Division, Match } }) {
            const { matches } = await Division.findById(id, {
                include: [{ model: Match }]
            })
            return matches
        }
    },
    DateTime: dateTimeResolver
}

module.exports = resolvers
