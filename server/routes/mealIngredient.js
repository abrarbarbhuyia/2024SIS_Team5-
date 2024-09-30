const express = require('express');
const router = express.Router();
const MealIngredient = require('../models/mealIngredientModel');
const databaseMaster = require('../databaseMaster');

/* Get a meal ingredient associated with a mealId */
router.get('/getMealIngredient/:mealId', async (req, res) => {
    try {
        const mealId = req.params.mealId;
        await databaseMaster.dbOp('find', 'MealIngredientDetails', { query: { mealId: mealId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create a meal ingredient */
router.post('/createMealIngredient', async (req, res) => {
    try {
        const mealIngredient = new MealIngredient({
            mealId: req.body.mealId,
            ingredientId: req.body.ingredientId
        });
        await databaseMaster.dbOp('insert', 'MealIngredientDetails', { docs: [mealIngredient] });
        res.status(201).json(mealIngredient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete a meal ingredient */
router.delete('/deleteMealIngredient/:mealId/:ingredientId', async (req, res) => {
    try {
        const mealId = req.params.mealId;
        const ingredientId = req.params.ingredientId;
        const query = { mealId: mealId, ingredientId: ingredientId }
        await databaseMaster.dbOp('delete', 'MealIngredientDetails', { query: query });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;