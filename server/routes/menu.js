const express = require('express');
const router = express.Router();
const Menu = require('../models/menuModel');
const databaseMaster = require('../databaseMaster');

const { v4: uuidv4 } = require('uuid');

/* Get a menu associated with a restaurantId */
router.get('/getMenu/:restaurantId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await databaseMaster.dbOp('find', 'MenuDetails', { query: { userId: userId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create a menu */
router.post('/createMenu', async (req, res) => {
    try {
        const menuId = uuidv4();

        const menu = new Menu({
            menuId: menuId,
            restaurantId: req.body.restaurantId,
            menuString: req.body.menuString
        });
        await databaseMaster.dbOp('insert', 'MenuDetails', { docs: [menu] });
        res.status(201).json(menu)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete a menu */
router.delete('/deleteFavourite/:menuId', async (req, res) => {
    try {
        const menuId = req.params.menuId;
        await databaseMaster.dbOp('delete', 'MenuDetails', { query: { menuId: menuId } } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;