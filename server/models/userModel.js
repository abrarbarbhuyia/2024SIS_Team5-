const { Schema, model } = require('mongoose');

var schema = Schema;

const userSchema = new schema({
    userId: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = model("User", userSchema);