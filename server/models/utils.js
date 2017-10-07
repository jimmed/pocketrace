const { DataTypes } = require('sequelize')

/* Model definition utilities */
const asModel = ({
    name,
    fields = {},
    relate,
    options,
    instanceMethods,
    staticMethods
}) => (db, models) => db.define(name, fields, options)

const bindInstanceMethods = (models, modelMakers) => {
    Object.entries(modelMakers).forEach(([name, maker]) => {
        const model = models[name]
        if (!maker.instanceMethods) return
        const methods = maker.instanceMethods(models)
        Object.entries(methods).forEach(([key, method]) => {
            model.prototype[key] = method
        })
    })
}

const bindStaticMethods = (models, modelMakers) => {
    Object.entries(modelMakers).forEach(([name, maker]) => {
        const model = models[name]
        if (!maker.instanceMethods) return
        const methods = maker.instanceMethods(models)
        Object.entries(methods).forEach(([key, method]) => {
            model[key] = method
        })
    })
}

const makeModels = (db, modelMakers) => {
    const models = Object.entries(
        modelMakers
    ).reduce((out, [name, makeModel]) => {
        out[name] = makeModel(db)
        return out
    }, {})
    relateModels(models)
    bindInstanceMethods(models, modelMakers)
    bindStaticMethods(models, modelMakers)
    return models
}

const relateModels = models =>
    Object.values(models).forEach(({ relate = () => {} }) => relate(models))

/**
 * State management utilities
 **/
class UnknownStateError extends Error {
    constructor(obj, newState) {
        super(`${newState} is not a valid state`)
    }
}

class StateTransitionError extends Error {
    constructor(obj, oldState, newState) {
        super(`Cannot transition from ${oldState} to ${newState}`)
    }
}

/**
 * Creates an ENUM DataType to model a finite state machine
 **/
const asStateMachine = (states, options = {}) => {
    const stateNames = Object.keys(states)
    return {
        type: DataTypes.ENUM(...stateNames),
        defaultValue: stateNames[0],
        set(newState) {
            if (!stateNames.includes(newState)) {
                throw new UnknownStateError(this, newState)
            }
            const oldState = this.getDataValue('state')
            const allowedTransitions = states[oldState]
            if (!allowedTransitions.includes(newState)) {
                throw new StateTransitionError(this, oldState, newState)
            }
            this.setDataValue('state', newState)
        }
    }
}

module.exports = {
    asModel,
    makeModels,
    relateModels,
    asStateMachine,
    UnknownStateError,
    StateTransitionError
}
