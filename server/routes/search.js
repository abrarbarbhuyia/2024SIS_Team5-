const express = require('express');
const router = express.Router();
const databaseMaster = require('../databaseMaster');

router.get('/', async (req, res) => {
    try {
        const ingredientFilter = req.query.ingredientFilter;
        const allergensFilter = req.query.allergens || [];
        const dietsFilter = req.query.diets || [];
        const searchQuery = req.query.searchQuery || '';

        const isFilterApplied = ingredientFilter || allergensFilter.length > 0 || dietsFilter.length > 0 || searchQuery;

        if (!isFilterApplied) {
            const allRestaurants = await databaseMaster.dbOp('find', 'RestaurantDetails', {});
            return res.json(allRestaurants);
        }

        let ingredientQuery = {
            name: { $regex: ingredientFilter, $options: 'i' }  // construct core query for ingredients - "name" will always return
        };

        if (allergensFilter.length > 0) { // only add the allergens filter if it's not empty
            ingredientQuery.allergens = { $nin: [allergensFilter] };
        }

        let filteredIngredients = await databaseMaster.dbOp('find', 'IngredientDetails', {
            query: ingredientQuery
        });

        const ingredientIds = filteredIngredients.map(ingredient => ingredient.ingredientId); // create an array of ingredientIds
        console.log(`ingredientIds that match applied filters ${ingredientIds}`);
        
        let mealQuery = {
            mealId: { $in: await getMealIdsForIngredients(ingredientIds) }
        };

        if (dietsFilter.length > 0) { // only add the diets filter if it has values
            mealQuery.diet = { $in: [dietsFilter] };
        }

        let mealResults = await databaseMaster.dbOp('find', 'MealDetails', { // search for meals that match diet AND whose mealId contains the ingredients before
            query: mealQuery
        });

        const mealIds = mealResults.map(meal => meal.mealId);
        console.log(`mealIds that match applied filters ${mealIds}`);

        const menuIds = mealResults.map(meal => meal.menuId);
        
        let restaurantQuery = {};

        if (menuIds.length > 0) {
            restaurantQuery.menuId = { $in: menuIds };
        }
        
        if (searchQuery !== '') {
            restaurantQuery.name = { $regex: searchQuery, $options: 'i' };
        }
        
        if (menuIds.length > 0 && searchQuery !== '') {
            restaurantQuery = {
                $and: [
                    { menuId: { $in: menuIds } },
                    { name: { $regex: searchQuery, $options: 'i' } }
                ]
            };
        }
        
        let restaurantResults = await databaseMaster.dbOp('find', 'RestaurantDetails', { query: restaurantQuery });

        const restaurantIds = restaurantResults.map(restaurant => restaurant.restaurantId);
        console.log(`restaurantIds that match applied filters ${restaurantIds}`);

        res.json(restaurantResults);
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