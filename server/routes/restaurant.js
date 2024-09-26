require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Restaurant = require('../models/restaurantModel');
const databaseMaster = require('../databaseMaster');
const {testFlow} = require('../allergenTest');

router.get('/getRestaurant/:restaurantId', async (req, res) => {
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

router.get('/searchRestaurants/:latitude/:longitude/:radius', async (req, res) => {
    //latitude, longitude of user and radius of search (in metres) in the request params
    const restaurant_ids = [];
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const radius = req.params.radius;
    //const latitude = -33.87941228154
    //const longitude = 151.20215135093403

    //perform a search query to return up to 10 restaurants (ids) that a within a specified metre radius from the set location specified by the latitude and longitude coordinates
    //will filter restaurants that are open at the time of search
    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude}%2C${longitude}&radius=${radius}&categories=13000&fields=fsq_id&open_now=true&limit=10`;
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
                //fetch the place details of the restaurant including location, name, telephone, hours and website
                const placeDetailsUrl = `https://api.foursquare.com/v3/places/${fsq_id}?fields=name%2Clocation%2Cgeocodes%2Chours%2Ctel%2Cwebsite%2Ccategories%2Cprice%2Crating%2Cstats`;
                const response1 = await axios.get(placeDetailsUrl, {
                    headers: {
                        Authorization: `${process.env.FOURSQUARE_API_KEY}`
                    }
                });

                //call the testFlow to create the menu and its associated meals and allergens
                const has_menu_flag = await testFlow(fsq_id);

                //if the restaurant has a valid menu, add the restaurant to the restaurant collection
                if (has_menu_flag)
                {   
                    //retrieve the restaurant's menu from the MenuDetails collection
                    const menu_find_result = await databaseMaster.dbOp('find', 'MenuDetails', { query: { restaurantId: fsq_id } });
                    const placeDetails = response1.data;

                    //iterate through the categories array to retrieve the cuisines
                    const categories_array = placeDetails.categories;
                    const cuisine = [];
                    cuisine_options = ["Chinese", "Australian", "Thai", "Asian", "Italian", "Greek", "Mexican", "Japanese", "Vietnamese", "Korean", "American", "French", "Turkish", "Indian"]
                    for (i = 0; i < categories_array.length; i++)
                    {
                        if(cuisine_options.includes(categories_array[i].short_name))
                        {
                            cuisine.push(categories_array[i].short_name);
                        }  
                    }
                    //create a restaurant entry using model schema and add new entry to the RestaurantDetails collection
                    const restaurant = new Restaurant({
                        restaurantId: fsq_id,
                        name: placeDetails.name,
                        address: placeDetails.location.formatted_address,
                        latitude: placeDetails.geocodes.main.latitude,
                        longitude: placeDetails.geocodes.main.longitude,
                        openingHours: placeDetails.hours.regular,
                        phoneNumber: placeDetails.tel,
                        website: placeDetails.website,
                        cuisine: cuisine,
                        price: placeDetails.price,
                        rating: placeDetails.rating,
                        total_ratings: placeDetails.stats.total_ratings,
                        menuId: menu_find_result[0].menuId
                    }) 
                    await databaseMaster.dbOp('insert', 'RestaurantDetails', { docs: [restaurant] });
                    restaurant_ids.push(fsq_id);
                }
            }
            else
            {
                restaurant_ids.push(fsq_id);
            }
        }  
        //a wierd bug where the restaurant_ids array were returning duplicates, quick fix for now
        res.json(Array.from(new Set(restaurant_ids)));
 
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
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            openingHours: req.body.openingHours,
            phoneNumber: req.body.phoneNumber,
            website: req.body.website,
            cuisine: req.body.cuisine,
            price: req.body.price,
            rating: req.body.rating,
            total_ratings: req.body.total_ratings,
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