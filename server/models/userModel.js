const { Schema, model } = require('mongoose')

var schema = Schema

const userSchema = new schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    favourites: { type: [String], required: true, default: [] },
    preferences: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true }
        }
    ]
});

module.exports = model("User", userSchema)