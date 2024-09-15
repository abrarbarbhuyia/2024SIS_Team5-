const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbOp } = require('../databaseMaster');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character')
], async (req, res) => {
    const validationFailures = validationResult(req);
    if (!validationFailures.isEmpty()) {
        return res.status(400).json({ message: validationFailures.array() });
    }

    const { username, password } = req.body;

    try {
        const existingUser = await dbOp('find', 'User', { query: { username } });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: `User ${username} already exists.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, password: hashedPassword };
        await dbOp('insert', 'User', { docs: [newUser] });

        res.status(201).json({ message: `User ${username} registered successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;