const { Schema, model } = require('mongoose')

var schema = Schema

restaurantSchema = new schema({
    restaurantId: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    openingHours: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    website: {type: String, required: true},
    cuisine: {type: Array[String], required: true},
    menuItemMatches: {type: Number},
    menuId: {type: String, required: true}
})

module.exports = model("Restaurant", restaurantSchema)