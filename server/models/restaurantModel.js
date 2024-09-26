const { Schema, model } = require('mongoose')

var schema = Schema

restaurantSchema = new schema({
    restaurantId: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
    openingHours: {type: Array, required: true}, //each array object represents lunchtime or dinnertime opening hours for a day
    phoneNumber: {type: String, required: true},
    website: {type: String, required: true},
    cuisine: {type: Array, minLength: 1,  required: false},
    price: {type: Number, required: true},
    rating: {type: Number, required: true}, //ratings score
    total_ratings: {type: Number, required: true}, //total number of ratings
    menuId: {type: String, required: true}
})

module.exports = model("Restaurant", restaurantSchema)