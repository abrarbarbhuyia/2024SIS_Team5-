const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            res.status(400).json({ message: `${username} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: `${username} registered successfully`});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;