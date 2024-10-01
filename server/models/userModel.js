const { Schema, model } = require('mongoose')

var schema = Schema

userSchema = new schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    notes: {type: Array[String], required: true, default: []},
    favourites: {type: Array[String], required: true, default: []},
    preferences: {type: Array[String], required: true, default: []},
})

module.exports = model("User", userSchema)