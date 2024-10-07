const express = require('express');
const router = express.Router();
const databaseMaster = require('../databaseMaster');
const bcrypt = require('bcrypt');

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

router.post('/changePassword/', async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;

        const user = await databaseMaster.dbOp('find', 'User', { query: { username: username } });
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const query = { username : username }
        const docs = { $set: { password: hashedNewPassword } };
        // Note: we have to swap query and docs because of the way we set up databaseMaster.
        await databaseMaster.dbOp('update', 'User', { docs, query });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;