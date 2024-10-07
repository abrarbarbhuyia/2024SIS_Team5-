const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const databaseMaster = require('../databaseMaster');

/* Create a user preference */
router.put('/createUserPreference/:userId', async (req, res) => {
    try {
        const preference = req.body.preference
        const query = { userId : req.params.userId }
        const docs = { $addToSet: { preferences: {$each: preference }} };
        const updatedMeal = await databaseMaster.dbOp('update', 'User', { query, docs });
        res.status(200).json(updatedMeal)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get a user preference */
router.get('/getUserPreference/:username', async (req, res) => {
    try {
        const query = { username: req.params.username };
        const user = await databaseMaster.dbOp('find', 'User', {query: query});
        res.status(200).json(user[0].preferences);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

/* Delete a user preference */
router.delete('/deleteUserPreference/:userId', async (req, res) => {
    try {
        const preferences = req.body.preferences;
        const query = { userId : req.params.userId }
        const docs = { $pull: { preferences: { $in: preferences } } };  // Using $pull to remove preferences
        const result = await databaseMaster.dbOp('update', 'User', { query, docs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router