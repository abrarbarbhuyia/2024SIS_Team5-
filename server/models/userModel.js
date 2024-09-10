const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

var schema = Schema;

const userSchema = new schema({
    userId: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Password hashing
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = model("User", userSchema);