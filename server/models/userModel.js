const { Schema, model } = require('mongoose')

var schema = Schema

userSchema = new schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    preferences: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true }
        }
      ]
})

module.exports = model("User", userSchema)