const { combineResolvers } = require('apollo-resolvers')

const Auth = require('./auth')

const resolvers = combineResolvers([Auth])

module.exports = resolvers
