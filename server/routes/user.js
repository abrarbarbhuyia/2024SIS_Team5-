const express = require('express');
const router = express.Router();
const databaseMaster = require('../databaseMaster');

router.get('/getUser/:userName', async (req, res) => {
    try {
        const userName = req.params.userName;
        await databaseMaster.dbOp('find', 'User', { query: { username: userName } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;