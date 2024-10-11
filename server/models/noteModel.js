const { Schema, model } = require('mongoose')

var schema = Schema

noteSchema = new schema({
    noteId: {type: String, required: true},
    date: {type: String, required: true},
    content: {type: String, required: true},
    restaurantId: {type: String, required: true},
    userId: {type: String, required: true},
    rating: {type: Number, required: true}
})

module.exports = model("Note", noteSchema)