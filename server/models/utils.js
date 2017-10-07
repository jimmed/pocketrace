const asModel = ({ name, fields = {}, relate }) => db => db.define(name, fields)

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

module.exports = { asModel, makeModels, relateModels }
