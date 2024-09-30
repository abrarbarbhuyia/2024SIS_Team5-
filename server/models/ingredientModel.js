const { Schema, model } = require('mongoose')

var schema = Schema

ingredientSchema = new schema({
    ingredientId: {type: String, required: true},
    name: {type: String, required: true},
    allergens: {type: [String], required: true}
})

module.exports = model("Ingredient", ingredientSchema)