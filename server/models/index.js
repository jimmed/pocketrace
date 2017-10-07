const { DataTypes } = require('sequelize')

const setupModels = (db, { log }) => {
    log.trace('Setting up models...')

    const Player = db.define('player', {
        isAdmin: DataTypes.BOOLEAN,
        state: DataTypes.ENUM('NotJoined', 'Joining', 'Joined', 'Leaving')
    })

    const Round = db.define('round', {
        state: DataTypes.ENUM('NotStarted', 'Started', 'Finished'),
        startDate: DataTypes.DATEONLY,
        endDate: DataTypes.DATEONLY
    })

    const Division = db.define('division', {
        name: DataTypes.STRING,
        order: DataTypes.INTEGER
    })

    const DivisionRanking = db.define('divisionRanking', {
        points: DataTypes.INTEGER,
        played: DataTypes.INTEGER,
        wins: DataTypes.INTEGER,
        losses: DataTypes.INTEGER
    })

    const Match = db.define('match', {
        state: DataTypes.ENUM('Scheduled', 'Started', 'Finished', 'Cancelled')
    })

    const MatchResult = db.define('matchResult', {
        completedAt: DataTypes.DATEONLY
    })

    log.trace('Setting up model relationships...')
    Player.belongsToMany(Division, { through: DivisionRanking })
    Round.hasOne(Round, { as: 'previousRound' })
    Round.hasOne(Round, { as: 'nextRound' })
    Round.hasMany(Division)
    Division.belongsToMany(Player, { through: DivisionRanking })
    Division.hasMany(Match)
    Match.hasOne(Match, { as: 'winner' })
    Match.hasOne(Match, { as: 'loser' })

    log.trace('Models set up!')
    return {
        PlayerModel: Player,
        RoundModel: Round,
        DivisionModel: Division,
        DivisionRankingModel: DivisionRanking,
        MatchModel: Match,
        MatchResultModel: MatchResult
    }
}

module.exports = { setupModels }
