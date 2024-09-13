const { Schema, model } = require('mongoose')

var schema = Schema

userSchema = new schema({
    userId: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = model("User", userSchema)