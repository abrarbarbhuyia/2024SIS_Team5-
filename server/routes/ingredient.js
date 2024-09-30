const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredientModel');
const databaseMaster = require('../databaseMaster');

const { v4: uuidv4 } = require('uuid');

/* Get an ingredient from it's ingredientId */
router.get('/getIngredient/:ingredientId', async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        await databaseMaster.dbOp('find', 'IngredientDetails', { query: { ingredientId: ingredientId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get an ingredient from it's name */
router.get('/getIngredientByName/:name', async (req, res) => {
    try {
        const name = req.params.name;
        await databaseMaster.dbOp('find', 'IngredientDetails', { query: { name: name } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create an ingredient */
router.post('/createIngredient', async (req, res) => {
    try {
        const ingredientId = uuidv4();

        const ingredient = new Ingredient({
            ingredientId: ingredientId,
            name: req.body.name,
            allergens: req.body.allergens
        });
        await databaseMaster.dbOp('insert', 'IngredientDetails', { docs: [ingredient] });
        res.status(201).json(ingredient)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Update the allergens of an ingredient (ingredientId) */
router.put('/editIngredient/:ingredientId', async (req, res) => {
    try {
        const { allergens } = req.body;
        const query = { ingredientId : req.params.ingredientId }
        const docs = { $set: { allergens: allergens } };
        await databaseMaster.dbOp('update', 'IngredientDetails', { query, docs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete an ingredient */
router.delete('/deleteIngredient/:ingredientId', async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        await databaseMaster.dbOp('delete', 'IngredientDetails', { query: { ingredientId: ingredientId } } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;