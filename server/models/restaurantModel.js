const { Schema, model } = require('mongoose')

var schema = Schema

restaurantSchema = new schema({
    restaurantId: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
    openingHours: {type: Array, required: false,  default: undefined}, //each array object represents lunchtime or dinnertime opening hours for a day
    phoneNumber: {type: String, required: true},
    website: {type: String, required: true},
    menuItemMatches: {type: Array},
    cuisineType: {type: Array,  required: false,  default: undefined}, //retrieves an array of cuisines and their associated icons
    restaurantType: {type: Array,  required: false,  default: undefined}, //retrieves an array of restaurant Type i.e cafe, bar, bakery and their associated icons
    price: {type: Number, required: true}, //number from 1 to 4 indiciating the approximate price range of the menu where 1 is the cheapest and 4 is the most expensive
    rating: {type: Number, required: true}, //ratings score
    total_ratings: {type: Number, required: true}, //total number of ratings    
    menuId: {type: String, required: true},
    restaurantPhotos: {type: Array,  required: false,  default: undefined},
    foodPhotos: {type: Array,  required: false,  default: undefined},
    hasMenu: {type: Boolean, required: true} //check if restaurant has a valid menu
})

module.exports = model("Restaurant", restaurantSchema)