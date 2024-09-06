const { Schema, model } = require('mongoose')

var schema = Schema

favouriteSchema = new schema({
    userId: {type: String, required: true},
    restaurantId: {type: String, required: true},
    starRating: {type: Number, required: true}
})

module.exports = model("Favourite", userSchema)