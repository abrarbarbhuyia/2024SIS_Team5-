const express = require('express');
const router = express.Router();
const databaseMaster = require('../databaseMaster');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const ingredientFilter = req.query.ingredients || [];
        const allergensFilter = req.query.allergens || [];
        const dietsFilter = req.query.diets || [];
        const cuisineFilter = req.query.cuisine || [];
        const mealFilter = req.query.meals || [];
        const searchQuery = req.query.searchQuery || '';
        // user location details
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        const radius = req.query.radius;

        /* fetch all restaurants in a given radius by calling searchRestaurant endpoint */
        // const restaurantsInRegion = await axios.get(`http://${process.env.HOST_IP}:4000/restaurant/searchRestaurants/${latitude}/${longitude}/${radius}`);

        /* a filter is applied if any of the arrays have elements or the strings have contents */
        const isFilterApplied = ingredientFilter.length > 0 || allergensFilter.length > 0 || dietsFilter.length > 0 || cuisineFilter.length > 0 || mealFilter.length > 0 || searchQuery;

        /* if no filter is applied, return all restaurants in the region */
        if (!isFilterApplied) {
            const allRestaurants = await databaseMaster.dbOp('find', 'RestaurantDetails', { 
                // query: { restaurantId: { $in: restaurantsInRegion.data } }
            });
            return res.json(allRestaurants.filter(r => r.hasMenu));
        }

        /* Query for Ingredients and Allergens Filters (IngredientDetails) */
        let ingredientQuery = {};

        if (ingredientFilter.length > 0) {
            ingredientQuery.$or = ingredientFilter.map(ingredient => ({ // create a regex query for each element in the ingredientFilter
                name: { $regex: ingredient, $options: 'i' } // return any ingredients that match the filter
            }));
        }

        if (allergensFilter.length > 0) { // only add the allergens filter if it's not empty
            ingredientQuery.allergens = { $nin: [allergensFilter] };
        }

        const filteredIngredients = await databaseMaster.dbOp('find', 'IngredientDetails', {
            query: ingredientQuery
        });

        const ingredientIds = filteredIngredients.map(ingredient => ingredient.ingredientId); // create an array of ingredientIds
        console.log(`ingredientIds that match applied filters ${ingredientIds}`);
        
        /* Ingredient Results + Query for Diets and Meals (MealDetails) */
        let mealQuery = {
            mealId: { $in: await getMealIdsForIngredients(ingredientIds) }
        };

        if (dietsFilter.length > 0) { // only add the diets filter if it has values
            mealQuery.diet = { $in: [dietsFilter] };
        }

        if (mealFilter.length > 0) {
            mealQuery.$or = mealFilter.map(meal => ({
                name: { $regex: meal, $options: 'i' }
            }));
        }

        const mealResults = await databaseMaster.dbOp('find', 'MealDetails', { // search for meals that match diet AND whose mealId contains the ingredients before
            query: mealQuery
        });
        
        let menuMealCount = mealResults.reduce((map, meal) => { // REDUUUUUUUUUCE !!
            const menuId = meal.menuId;
            map.set(menuId, [...(map.get(menuId) || []), meal.mealId]);
            return map;
        }, new Map());

        /* Core Restaurant Query - Restaurants in the region + menuIds that contain the resulting meals from previous filtering + name regex query */
        const menuIds = mealResults.map(meal => meal.menuId);
        let restaurantQuery = { 
            // restaurantId: { $in: restaurantsInRegion.data },
            menuId: { $in: menuIds },
            name: { $regex: searchQuery, $options: 'i' }
        };

        if (cuisineFilter.length > 0) {
            restaurantQuery.$or = cuisineFilter.map(cuisine => ({
                cuisineType: { $elemMatch: { cuisineType: { $regex: cuisine, $options: 'i' } } }
            }));
        }
        
        const restaurantResults = await databaseMaster.dbOp('find', 'RestaurantDetails', { query: restaurantQuery });
        const updatedRestaurantResults = restaurantResults.filter(r => r.hasMenu).map(r => ({
            ...r, menuItemMatches: menuMealCount.get(r.menuId)
        }));

        res.json(updatedRestaurantResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

async function getMealIdsForIngredients(ingredientIds) {
    const mealIngredientMappings = await databaseMaster.dbOp('find', 'MealIngredientDetails', {
        query: {
            ingredientId: { $in: ingredientIds }
        }
    });
    
    return mealIngredientMappings.map(mapping => mapping.mealId);
}

module.exports = router;