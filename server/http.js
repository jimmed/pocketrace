const express = require('express')
const expressLogger = require('express-driftwood')
const bodyParser = require('body-parser')
const { GraphQLError } = require('graphql')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { createExpressContext } = require('apollo-resolvers')
const { formatError: apolloFormatError, createError } = require('apollo-errors')
const { UnknownError } = require('./resolvers/errors')
const { getSchema } = require('./schema')

const formatError = error => {
    const e = apolloFormatError(error)
    return e instanceof GraphQLError
        ? apolloFormatError(
              new UnknownError({
                  data: {
                      originalMessage: e.message,
                      originalError: e.name
                  }
              })
          )
        : e
}

const setupHttp = async (models, { port = 3000 }, { log }) => {
    const app = express()

    log.trace('Configuring router...')
    app.use(expressLogger(log))
    app.use(bodyParser.json())

    app.use((req, res, next) => {
        req.user = null // TODO: fetch the user making the request
        next()
    })

    log.trace('Fetching GraphQL schema...')
    const schema = await getSchema()
    app.post(
        '/graphql',
        graphqlExpress((req, res) => {
            const graphQLLogger = log('graphQL')
            const user = req.user
            const context = createExpressContext(
                { models, user, log: graphQLLogger },
                res
            )
            return { schema, formatError, context }
        })
    )

    app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
    log.trace('Launching server...')
    await new Promise(resolve => app.listen(port, resolve))
    log.info(
        `Server listening!\n\n - GraphiQL: http://0.0.0.0:${port}/graphiql`
    )
    return app
}

module.exports = { setupHttp }
