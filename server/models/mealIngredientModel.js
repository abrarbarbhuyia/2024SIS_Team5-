const { Schema, model } = require('mongoose')

var schema = Schema

mealIngredientSchema = new schema({
    mealId: {type: String, required: true},
    ingredientId: {type: String, required: true}
})

module.exports = model("MealIngredient", mealIngredientSchema)