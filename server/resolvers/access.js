const { baseResolver } = require('./base')
const { AuthenticationError, AuthorizationError } = require('./errors')

const isAuthenticatedResolver = baseResolver.createResolver(
    (root, args, { user }) => {
        if (!user) throw new AuthenticationError()
    }
)

const isAdminResolver = isAuthenticatedResolver.createResolver(
    (root, args, { user }) => {
        if (!user.isAdmin) throw new AuthorizationError()
    }
)

module.exports = {
    isAuthorizedResolver,
    isAdminResolver
}
