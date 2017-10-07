const { DataTypes } = require('sequelize')

/* Model definition utilities */
const asModel = ({
    name,
    fields = {},
    relate,
    options,
    instanceMethods,
    staticMethods
}) => db => {
    const model = db.define(name, fields, options)
    // TODO: Bind instance methods
    bindInstanceMethods(model, instanceMethods)
    // TODO: Bind static methods
    bindStaticMethods(model, staticMethods)
    return model
}

const bindStaticMethods = (model, methods = {}) => Object.assign(model, methods)
const bindInstanceMethods = (model, methods = {}) =>
    Object.assign(model.prototype, methods)

const makeModels = (db, modelMakers) => {
    const models = Object.entries(
        modelMakers
    ).reduce((out, [name, makeModel]) => {
        out[name] = makeModel(db)
        return out
    }, {})
    relateModels(models)
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
