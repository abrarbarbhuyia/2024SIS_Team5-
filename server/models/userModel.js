const { Schema, model } = require('mongoose')

var schema = Schema

const userSchema = new schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    favourites: { type: [String], required: true, default: [] },
    notes: { 
        type: [
            {
                restaurantId: { type: String, required: true },
                note: { type: String, required: true }
            }
        ], 
        required: true, 
        default: [] 
    },
    preferences: { 
        type: [
            {
                type: { type: String, required: true },
                value: { type: String, required: true }
            }
        ], 
        required: true, 
        default: [] 
    }
});

module.exports = model("User", userSchema)