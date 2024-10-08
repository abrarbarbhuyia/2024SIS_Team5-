const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const databaseMaster = require('../databaseMaster');

/* Create a user preference */
router.put('/createUserPreference/:username', async (req, res) => {
    try {
        const preference = req.body.preference;
        const query = { username: req.params.username };
        const docs = { $addToSet: { preferences: { $each: preference } } };
        const updatedUser = await databaseMaster.dbOp('update', 'User', { query, docs });
        res.status(200).json(updatedUser);
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
router.delete('/deleteUserPreference/:username', async (req, res) => {
    try {
        const preferenceName = req.body.preferenceName; 
        const query = { username: req.params.username };
        const docs = { $pull: { preferences: { name: preferenceName } } }; 

        const result = await databaseMaster.dbOp('update', 'User', { query, docs });

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Preference deleted successfully' });
        } else {
            res.status(404).json({ message: 'Preference not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router