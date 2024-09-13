const express = require('express');
const router = express.Router();
const Meal = require('../models/mealModel');
const databaseMaster = require('../databaseMaster');

/* Get all meals from a menuId */
router.get('/getMealByMenuId/:menuId', async (req, res) => {
    try {
        const menuId = req.params.menuId;
        await databaseMaster.dbOp('find', 'MealDetails', { query: { menuId: menuId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get a meal from a mealId */
router.get('/getMealById/:mealId', async (req, res) => {
    try {
        const mealId = req.params.mealId;
        await databaseMaster.dbOp('find', 'MealDetails', { query: { mealId: mealId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get a meal from a meal name */
router.get('/getMealByName/:name', async (req, res) => {
    try {
        const name = req.params.name;
        await databaseMaster.dbOp('find', 'MealDetails', { query: { name: name } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get the diets associated with a mealId -- TODO: still need to filter results */
router.get('/getDiets/:mealId', async (req, res) => {
    try {
        const mealId = req.params.mealId;
        await databaseMaster.dbOp('find', 'MealDetails', { query: { mealId: mealId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create a meal */
router.post('/createMeal', async (req, res) => {
    try {
        const meal = new Meal({
            mealId: req.body.mealId,
            name: req.body.name,
            diet: req.body.diet,
            menuId: req.body.menuId
        });
        const result = await databaseMaster.dbOp('insert', 'MealDetails', { docs: [meal] });
        res.status(201).json(meal)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Update the diets associated with a mealId - TODO */
router.put('/editIngredient/:ingredientId', async (req, res) => {
    try {
        const { diet } = req.body;
        const query = { ingredientId : req.params.ingredientId }
        const docs = { $set: { diet: diet } };
        await databaseMaster.dbOp('update', 'MealDetails', { query, docs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete a meal */
router.delete('/deleteIngredient/:ingredientId', async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        await databaseMaster.dbOp('delete', 'MealDetails', { query: { ingredientId: ingredientId } } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;