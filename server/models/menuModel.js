const { Schema, model } = require('mongoose')

var schema = Schema

menuSchema = new schema({
    menuId: {type: String, required: true},
    restaurantId: {type: String, required: true},
    menuString: {type: String, required: true}
})

module.exports = model("Menu", menuSchema)