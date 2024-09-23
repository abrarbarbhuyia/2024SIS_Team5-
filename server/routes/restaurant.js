require('dotenv').config();
const express = require('express');
const axios = require('axios');
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

router.get('/getRestaurant', async (req, res) => {
    const latitude = -33.87941228154
    const longitude = 151.20215135093403
    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude}%2C${longitude}&categories=13000`;

    try {
        // fetch the restaurants nearby the specified latitude and longitude location (set to UTS Building 5)
        const response = await axios.get(url, {
            headers: {
                Authorization: `${process.env.FOURSQUARE_API_KEY}`
            }
        });
        
        // iterate through each restaurant in the resulting array
        const restaurants_array = response.data.results
        for(let i = 0; i < restaurants_array.length; i++)
        {
            const restaurant = restaurants_array[i];
            const fsq_id = restaurant.fsq_id;

            // check if the restaurant matches an existing entry in the restaurantdetails database
            const query = { restaurantId: fsq_id };
            const result = await databaseMaster.dbOp('find', 'RestaurantDetails', { query });

            // if there is no existing entry
            if (result.length == 0)

            {
                //fetch the place details of the restaurant including location, name, telephone, hours and webstie
                const placeDetailsUrl = `https://api.foursquare.com/v3/places/${fsq_id}?fields=tel%2Cname%2Chours%2Clocation%2Cwebsite`;
                const response1 = await axios.get(placeDetailsUrl, {
                    headers: {
                        Authorization: `${process.env.FOURSQUARE_API_KEY}`
                    }
                });
                const placeDetails = response1.data

                //create a restaurant entry using model schema and add new entry to the RestaurantDetails colelction
                const restaurant = new Restaurant({
                    restaurantId: fsq_id,
                    name: placeDetails.name,
                    address: placeDetails.location.formatted_address,
                    openingHours: placeDetails.hours.display,
                    phoneNumber: parseInt(placeDetails.tel),
                    website: placeDetails.website,
                }) 
                await databaseMaster.dbOp('insert', 'RestaurantDetails', { docs: [restaurant] });  
            }
        }  
 
    } catch(error) {
        console.error(error);
        throw new Error('Failed to get restaurant!');
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