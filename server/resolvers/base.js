const { createResolver } = require('apollo-resolvers')
const { isInstance } = require('apollo-errors')

const baseResolver = createResolver(
    null,
    (root, args, context, error) =>
        isInstance(error) ? error : new UnknownError()
)

module.exports = { baseResolver }
