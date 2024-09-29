const { Schema, model } = require('mongoose')

var schema = Schema

restaurantSchema = new schema({
    restaurantId: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    openingHours: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    website: {type: String, required: true},
    menuId: {type: String, required: true},
    cuisine: {type: String, required: true},
    restaurantPhotos: {type: [String], required: false},
})

module.exports = model("Restaurant", restaurantSchema)