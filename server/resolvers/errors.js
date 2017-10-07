const { createError } = require('apollo-errors')

const errors = {
    Unknown: {
        message: 'An unknown error has occurred!'
    },
    Authentication: {
        message: 'You must be authenticated to perform this action'
    },
    Authorization: {
        message: 'You are not authorized to perform this action'
    }
}

module.exports = {}
Object.entries(errors).forEach(([name, options = {}]) => {
    const fullName = `${name}Error`
    module.exports[fullName] = createError(fullName, options)
})
