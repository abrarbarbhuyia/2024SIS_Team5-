const { Schema, model } = require('mongoose')

var schema = Schema

mealSchema = new schema({
    mealId: {type: String, required: true},
    name: {type: String, required: true},
    diet: {type: [String], required: false},
    menuId: {type: String, required: false},
    description: {type: String, required: true},
    price: {type: String, required: true},
})

module.exports = model("Meal", mealSchema)