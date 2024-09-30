const express = require('express');
const router = express.Router();
const databaseMaster = require('../databaseMaster');

router.get('/getUser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await databaseMaster.dbOp('find', 'User', { query: { userId: userId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});