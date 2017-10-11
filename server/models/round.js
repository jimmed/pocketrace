const { DataTypes, Op } = require('sequelize')
const { addMonths } = require('date-fns/add_months')
const { asModel, asStateMachine } = require('./utils')
const { shuffle, chunk, orderBy, range } = require('lodash')

const roundModel = {
    name: 'round',
    fields: {
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state: asStateMachine({
            NotStarted: ['Started'],
            Started: ['Finished'],
            Finished: []
        })
    },
    relate: ({ Round, Division }) => {
        Round.hasOne(Round, { as: 'previousRound' })
        Round.hasOne(Round, { as: 'nextRound' })
        Round.hasMany(Division)
    },
    instanceMethods: ({ Round, Division, Player }) => ({
        async start() {
            await this.createDivisions()
            return await this.update({ state: 'Started' })
        },
        async createNext() {
            const existing = await this.getNextRound()
            if (existing) {
                throw new Error('Next round already created')
            }
            return Round.create({
                startDate: this.endDate,
                endDate: addMonths(this.endDate, 1),
                previousRound: this
            })
        },
        async startNext() {
            const nextRound =
                (await this.getNextRound()) || (await this.createNext())
            await nextRound.start()
        },
        async finish() {
            this.state = 'Finished'
            await this.startNext()
        },
        async createDivisions() {
            if (this.state !== 'NotStarted') {
                throw new Error(
                    'Can only created divisions before round is started'
                )
            }
            const previousRound = await this.getPreviousRound()
            const newDivisions = previousRound
                ? await this.createDivisionsFromPreviousRound(previousRound)
                : await this.createDivisionsFromScratch()
        },
        async createDivisionsFromScratch({ maxSize = 7, minSize = 4 }) {
            // Get all joined/joining players
            const players = Player.findAll({
                where: { state: { [Op.in]: ['Joined', 'Joining'] } }
            })
            // Find optimum size of divisions for number of players
            const divisionSize = getOptimumDivisionSize(players.length, {
                maxSize,
                minSize
            })
            // Split players into divisions at random
            const playerDivisions = chunk(shuffle(players), divisionSize)

            // Create divisions
            return await Division.bulkCreate(
                playerDivisions.map((players, order) => ({
                    name: `Division ${order + 1}`,
                    order,
                    players
                }))
            )
        },
        async createDivisionsFromPreviousRound(
            previousRound,
            { maxSize = 7, minSize = 4 }
        ) {
            const previousDivisions = await previousRound.getDivisions()
            // Get all players from previous round's divisions
            const leaderboards = await Promise.all(
                previousDivisions.map(
                    async division => await division.getLeaderboard()
                )
            )
            // Promote/demote players from top/bottom of each division
            const afterPromotions = leaderboards
                .map((rankings, order) =>
                    orderBy(
                        rankings.filter(({ state }) => state === 'Joined'),
                        [['points', 'desc'], ['pocketDifference', 'desc']]
                    )
                )
                .map((rankings, order, divisions) => {
                    const shouldPromoteLeader = order > 0
                    const shouldDemoteLoser = order < divisions.length - 1
                    const divisionAbove = Divisions[order - 1]
                    const divisionBelow = divisions[order + 1]
                    return [
                        shouldPromoteLeader
                            ? divisionAbove[divisionAbove.length - 1]
                            : rankings[0],
                        ...rankings.slice(1, -1),
                        shouldDemoteLoser
                            ? divisionBelow[0]
                            : rankings[rankings.length - 1]
                    ]
                })
                .concat(await Player.findAll({ where: { state: 'Joining' } }))

            // Find optimum size of divisions for number of players
            const divisionSize = getOptimumDivisionSize(
                afterPromotions.length,
                { maxSize, minSize }
            )
            // Reflow divisions to handle size changes!
            const newDivisions = chunk(flatten(afterPromotions), divisionSize)
            // Create divisions
            return await Promise.all(
                newDivisions.map((players, order) => ({
                    name: `Division ${order}`,
                    order,
                    players
                }))
            )
        }
    })
}

const getOptimumDivisionSize = (count, { maxSize, minSize }) => {
    const attempts = []
    for (let size = minSize; size <= maxSize; size++) {
        attempts.push({
            size,
            // Number left when as many full groups as possible are created
            trailing: count % (size * Math.floor(count / size))
        })
    }
    const best = attempts.reduce(
        (best, next) => (next.trailing < best.trailing ? next : best)
    )
    return best.size
}

module.exports = asModel(roundModel)
