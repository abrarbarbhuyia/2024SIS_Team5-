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
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/changePassword/', async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;

        const user = await databaseMaster.dbOp('find', 'User', { query: { username: username } });
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const query = { username : username }
        const docs = { $set: { password: hashedNewPassword } };
        // Note: we have to swap query and docs because of the way we set up databaseMaster.
        await databaseMaster.dbOp('update', 'User', { docs, query });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


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

/* Delete a user favourites */
router.delete('/deleteFavourite/:username/:restaurantId', async(req,res) => 
{
    try {
        const restaurantId = req.params.restaurantId; 
        const query = { username: req.params.username };
        const docs = { $pull: { favourites: restaurantId } }; 

        const result = await databaseMaster.dbOp('update', 'User', { query, docs });

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Favourite deleted successfully' });
        } else {
            res.status(404).json({ message: 'Favourite not found' });
        }
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router