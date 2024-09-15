const express = require('express');
const router = express.Router();
const databaseMaster = require('../databaseMaster');

router.get('/', async (req, res) => {
    try {
        const searchFilter = req.query.searchFilter;
        const allergensFilter = req.query.allergens || [];
        const dietsFilter = req.query.diets || [];
        var response = [];

        let filteredResults = await databaseMaster.dbOp('find', 'IngredientDetails', {
            query: {
                name: { $regex: searchFilter, $options: 'i' },
                allergens: { $nin: [allergensFilter] }
            }
        });

        let mealResults = await databaseMaster.dbOp('find', 'MealDetails', {
            query: {
                diet: [dietsFilter]
            }
        });

        response.push(filteredResults, mealResults);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;