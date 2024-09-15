const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbOp } = require('../databaseMaster');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {
    const validationFailures = validationResult(req);
    if (!validationFailures.isEmpty()) {
        return res.status(400).json({ validationFailures: validationFailures.array() });
    }

    const { username, password } = req.body;

    try {
        const existingUser = await dbOp('find', 'User', { query: { username } });
        if (existingUser.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser[0].password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ username: existingUser[0].username }, JWT_SECRET);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;