require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Restaurant = require('../models/restaurantModel');
const databaseMaster = require('../databaseMaster');
const { testFlow } = require('../allergenTest');

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
    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude}%2C${longitude}&radius=${radius}&categories=13000&fields=fsq_id&open_now=true&limit=5`;
    try {
        // fetch the restaurants nearby the specified latitude and longitude location (set to UTS Building 5)
        await axios.get(url, {
            headers: {
                Authorization: `${process.env.FOURSQUARE_API_KEY}`
            }
        }).then(async (response) => {
            const restaurants_array = response.data.results

            for (let i = 0; i < restaurants_array.length; i++) {
                const restaurant = restaurants_array[i];
                const fsq_id = restaurant.fsq_id;

                await axios.get(
                    process.env.BACKEND_URL + `/restaurant/getRestaurant/${fsq_id}`).then(async (response1) => {
                        // if there is no existing entry
                        if (response1.data.length == 0) {
                            await testFlow(fsq_id).then(async (response2) => {
                                if (response2) {
                                    //fetch the place details of the restaurant including location, name, telephone, hours and website
                                    const placeDetailsUrl = `https://api.foursquare.com/v3/places/${fsq_id}?fields=name%2Clocation%2Cgeocodes%2Chours%2Ctel%2Cwebsite%2Ccategories%2Cprice%2Crating%2Cstats`;
                                    const response1 = await axios.get(placeDetailsUrl, {
                                        headers: {
                                            Authorization: `${process.env.FOURSQUARE_API_KEY}`
                                        }
                                    });

                                    //fetch 5 most popular indoor and/or outdoor photos of the restaurant
                                    const restaurantPhotosUrl = `https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=5&classifications=indoor%2Coutdoor`;
                                    const response2 = await axios.get(restaurantPhotosUrl, {
                                        headers: {
                                            Authorization: `${process.env.FOURSQUARE_API_KEY}`
                                        }
                                    });

                                    //iterate through each photo in the array
                                    var place_photo_array = response2.data
                                    var restaurant_photo_array = [];
                                    for (let i = 0; i < place_photo_array.length; i++) {
                                        //concatenate the menu_url_string to "prefix" + "widthxheight" + "height"
                                        const menu_url = place_photo_array[i].prefix + place_photo_array[i].width + "x" + place_photo_array[i].height + place_photo_array[i].suffix;
                                        restaurant_photo_array.push(menu_url)
                                    }

                                    //fetch 5 most popular food photos of the restaurant
                                    const foodPhotosUrl = `https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=5&classifications=food`;
                                    const response3 = await axios.get(foodPhotosUrl, {
                                        headers: {
                                            Authorization: `${process.env.FOURSQUARE_API_KEY}`
                                        }
                                    });

                                    place_photo_array = response3.data
                                    var food_photo_array = [];
                                    for (let i = 0; i < place_photo_array.length; i++) {
                                        //concatenate the menu_url_string to "prefix" + "widthxheight" + "height"
                                        const menu_url = place_photo_array[i].prefix + place_photo_array[i].width + "x" + place_photo_array[i].height + place_photo_array[i].suffix;
                                        food_photo_array.push(menu_url)
                                    }

                                    //retrieve the restaurant's menu from the MenuDetails collection
                                    const menu_find_result = await databaseMaster.dbOp('find', 'MenuDetails', { query: { restaurantId: fsq_id } });
                                    const placeDetails = response1.data;

                                    //iterate through the categories array to retrieve the cuisines and restaurantTypes
                                    const categories_array = placeDetails.categories;
                                    const cuisineType_array = [];
                                    const restaurantType_array = [];
                                    const cuisineTypes = ["Chinese", "Australian", "Thai", "Asian", "Italian", "Greek", "Mexican", "Japanese", "Vietnamese", "Korean", "American", "French", "Turkish", "Indian", "Malay", "Korean BBQ", "Mediterranean"];
                                    for (i = 0; i < categories_array.length; i++) {
                                        if (cuisineTypes.includes(categories_array[i].short_name)) {
                                            //retrieve the cuisine name and associated icon png at size 64 pixels
                                            const cuisine_icon_url = categories_array[i].icon.prefix + "64.png"
                                            cuisineType_array.push({ "cuisineType": categories_array[i].short_name, "icon": cuisine_icon_url });
                                        }

                                        else {
                                            //retrieve the restaurant Type and associated icon png at size 64 pixels
                                            const restaurantType_icon_url = categories_array[i].icon.prefix + "64.png"
                                            restaurantType_array.push({ "restaurantType": categories_array[i].short_name, "icon": restaurantType_icon_url });
                                        }
                                    }

                                    //create a restaurant entry using model schema and add new entry to the RestaurantDetails collection
                                    const requestBody = {
                                        restaurantId: fsq_id,
                                        name: placeDetails.name,
                                        address: placeDetails.location.formatted_address,
                                        latitude: placeDetails.geocodes.main.latitude,
                                        longitude: placeDetails.geocodes.main.longitude,
                                        openingHours: placeDetails.hours.regular,
                                        phoneNumber: placeDetails.tel,
                                        website: placeDetails.website,
                                        cuisineType: cuisineType_array,
                                        restaurantType: restaurantType_array,
                                        price: placeDetails.price,
                                        rating: placeDetails.rating,
                                        total_ratings: placeDetails.stats.total_ratings,
                                        restaurantPhotos: restaurant_photo_array,
                                        foodPhotos: food_photo_array,
                                        menuId: menu_find_result[0].menuId,
                                        hasMenu: true
                                    };

                                    try {
                                        await axios.post(
                                            process.env.BACKEND_URL + `/restaurant/createRestaurant/`,
                                            requestBody
                                        );
                                        console.log("Created Restaurant");
                                    } catch (error) {
                                        console.error("Error creating the restaurant", error)
                                    }

                                }
                                else {
                                    //for restaurants without a valid menu, create any entry in the restaurant details collections but set the hasMenuFlag to false
                                    const requestBody = {
                                        restaurantId: fsq_id,
                                        hasMenu: false
                                    };

                                    try {
                                        await axios.post(
                                            process.env.BACKEND_URL + `/restaurant/createRestaurant/`,
                                            requestBody
                                        );
                                        console.log("Created a Restaurant with no menu");
                                    } catch (error) {
                                        console.error("Error creating the restaurant", error)
                                    }

                                }
                            });

                        }
                        else {

                            if (response1.data[0].hasMenu) {
                                restaurant_ids.push(fsq_id);
                            }
                        }
                    }).catch(error => {
                        console.error("Error retrieving restaurant entry from database", error)
                    });
            }
        });
        //a wierd bug where the restaurant_ids array were returning duplicates, quick fix for now
        res.json(Array.from(new Set(restaurant_ids)));

    } catch (error) {
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
            cuisineType: req.body.cuisineType,
            restaurantType: req.body.restaurantType,
            price: req.body.price,
            rating: req.body.rating,
            total_ratings: req.body.total_ratings,
            menuId: req.body.menuId,
            restaurantPhotos: req.body.restaurantPhotos,
            foodPhotos: req.body.foodPhotos,
            hasMenu: req.body.hasMenu

        });
        await databaseMaster.dbOp('insert', 'RestaurantDetails', { docs: [restaurant] });
        res.status(201).json(restaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Update any field for a restaurantId based on params -- TODO */
router.put('/editRestaurant/:restaurantId', async (req, res) => {
    try {
        const { updateField } = req.body;
        const query = { restaurantId: req.params.restaurantId }
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
        await databaseMaster.dbOp('delete', 'RestaurantDetails', { query: { restaurantId: restaurantId } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;