const express = require('express');
const router = express.Router();
const Favourite = require('../models/favouriteModel');
const databaseMaster = require('../databaseMaster');

/* Get the favourite rating associated with a userId */
router.get('/getFavourites/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await databaseMaster.dbOp('find', 'FavouriteDetails', { query: { userId: userId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get a favourite associated with a restaurantId from a given userId */
router.get('/getFavouriteRestaurant/:userId/:restaurantId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;
        const query = { userId: userId, restaurantId: restaurantId }
        await databaseMaster.dbOp('find', 'FavouriteDetails', { query: query }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create a favourite */
router.post('/createFavourite', async (req, res) => {
    try {
        const favourite = new Favourite({
            userId: req.body.userId,
            restaurantId: req.body.restaurantId,
            starRating: parseInt(req.body.starRating)
        });
        await databaseMaster.dbOp('insert', 'FavouriteDetails', { docs: [favourite] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Update the star rating of a favourite (favouriteId) */
router.put('/editFavourite/:favouriteId', async (req, res) => {
    try {
        const { starRating } = parseInt(req.body);
        const query = { favouriteId : req.params.favouriteId }
        const docs = { $set: { starRating: starRating } };
        await databaseMaster.dbOp('update', 'FavouriteDetails', { query, docs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete a favourite */
router.delete('/deleteFavourite/:favouriteId', async (req, res) => {
    try {
        const favouriteId = req.params.favouriteId;
        await databaseMaster.dbOp('delete', 'FavouriteDetails', { query: { favouriteId: favouriteId } } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;