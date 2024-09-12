const { Schema, model } = require('mongoose')

var schema = Schema

mealSchema = new schema({
    mealId: {type: String, required: true},
    name: {type: String, required: true},
    diet: {type: Array[String], required: true},
    menuId: {type: String, required: true}
})

module.exports = model("Meal", mealSchema)