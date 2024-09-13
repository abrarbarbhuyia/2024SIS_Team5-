const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurantModel');
const databaseMaster = require('../databaseMaster');

/* Get a restaurant from a restaurantId */
router.get('/getIngredient/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        await databaseMaster.dbOp('find', 'RestaurantDetails', { query: { restaurantId: restaurantId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create a restaurant */
router.post('/createRestaurant', async (req, res) => {
    try {
        const restaurant = new Restaurant({
            restaurantId: req.body.restaurantId,
            name: req.body.name,
            address: req.body.address,
            openingHours: req.body.openingHours,
            phoneNumber: parseInt(req.body.phoneNumber),
            website: req.body.website,
            menuId: req.body.menuId
        });
        await databaseMaster.dbOp('insert', 'RestaurantDetails', { docs: [restaurant] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Update any field for a restaurantId based on params -- TODO */
router.put('/editRestaurant/:restaurantId', async (req, res) => {
    try {
        const { updateField } = req.body;
        const query = { restaurantId : req.params.restaurantId }
        const docs = { $set: { updateField: updateField } };
        await databaseMaster.dbOp('update', 'RestaurantDetails', { query, docs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete a restaurant */
router.delete('/deleteRestaurant/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        await databaseMaster.dbOp('delete', 'RestaurantDetails', { query: { restaurantId: restaurantId } } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;