require('dotenv').config();
const express = require('express');
const router = express.Router();
const Menu = require('../models/menuModel');
const databaseMaster = require('../databaseMaster');
const axios = require('axios');
const Tesseract = require('tesseract.js');


const { v4: uuidv4 } = require('uuid');

/* Get a menu associated with a restaurantId */
router.get('/getMenu/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const data = await databaseMaster.dbOp('find', 'MenuDetails', { query: { restaurantId: restaurantId } });
        // .then(data => {
        //     res.status(200).json(data);
        // });
        if(data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Menu not found' })
        } 
    }   
    catch (error) {
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

/* Get a menu using restaurant Id */
router.get('/getMenuString/:restaurantId', async (req, res) => {
    const placeId = req.params.restaurantId;
    const url = `https://api.foursquare.com/v3/places/${placeId}/photos?classifications=menu`;

    try {
        // Retrieve menu images by calling Foursquare's place photo request using the restaurant id
        const response = await axios.get(url, {
            headers: {
                Authorization: `${process.env.FOURSQUARE_API_KEY}`
            }
        });

        const place_photo_array = response.data;
        let menu_items = [];  
        let isMenuFound = false; 

        for (let i = 0; i < place_photo_array.length; i++) {
            const menu_image = place_photo_array[i];
            const menu_url = menu_image.prefix + menu_image.width + "x" + menu_image.height + menu_image.suffix;

            const result = await Tesseract.recognize(menu_url, 'eng');
            const cleaned_string = result.data.text.replace(/[^\w\s.$\n-]/g, '').trim();

            // Check if the image isMenu
            const is_menu_flag = await isMenu(cleaned_string);
            if (is_menu_flag) {
                isMenuFound = true;

                const pricePattern = /\$\d+(?:\.\d{2})?/g;
                const descriptionPattern = /\(([^)]+)\)/g;  
                const lines = cleaned_string.split(/\n/);  // split text by newlines

                let currentItem = '';
                let currentDescription = '';
                let currentPrice = '';

                lines.forEach((line, index) => {
                    const priceMatch = line.match(pricePattern);

                    if (priceMatch) {
                        if (currentItem) {
                            menu_items.push({
                                item: currentItem.trim(),
                                description: currentDescription.trim() || '',
                                price: currentPrice.trim()
                            });
                        }

                        currentPrice = priceMatch[0]; // Get the price
                        const textWithoutPrice = line.replace(priceMatch[0], '').trim();
                        const descriptionMatch = textWithoutPrice.match(descriptionPattern);
                        currentDescription = descriptionMatch ? descriptionMatch[0].replace(/[()]/g, '').trim() : '';
                        currentItem = textWithoutPrice.replace(descriptionMatch ? descriptionMatch[0] : '', '').trim();
                    } else if (currentItem) {
                        // If no price but still part of the same item, set description
                        if (currentDescription) {
                            currentDescription += ' ' + line.trim();
                        } else {
                            currentDescription = line.trim();
                        }
                    }
                });

                // Push the last item if exists
                if (currentItem) {
                    menu_items.push({
                        item: currentItem.trim(),
                        description: currentDescription.trim() || '',
                        price: currentPrice.trim()
                    });
                }
            }
        }

        if (isMenuFound) {
            console.log("Item is a menu");
        } else {
            console.log("Item is not a menu");
        }

        console.log(menu_items);
        res.json(menu_items);  // Respond with the menu items as an object
    } catch (error) {
        console.error(error);
        throw new Error('Menu was not found!');
    }
});

async function isMenu(extractedText) {
    const commonKeywords = ['appetizers', 'appetizer', 'appetiser', 'appetisers', 'main course', 'dessert',  'desserts', 'starter',  'starters', 'salad', 
                            'salads', 'drink', 'drinks', 'entree', 'entrees', 'side',  'sides', 'beverage', 'beverages', 'soup', 'soups', 'main',
                            'mains', 'lunch', 'menu', 'vegetable', 'vegetables',  'breakfast', 'seafood', 'meat', 'chicken', 'fish', 'noodle', 'noodles'];

    const pricePattern = /\$\d+(\.\d{2})?/g;
    const textLower = extractedText.toLowerCase();
    const commonKeywordCount = commonKeywords.reduce((count, keyword) => {
        return count + (textLower.includes(keyword) ? 1 : 0);
    }, 0);

    const priceCount = (textLower.match(pricePattern) || []).length;

    // Check for at least one price and common keyword in the text to determine if it is a menu
    return commonKeywordCount >= 1 && priceCount >= 1;
}

module.exports = router;
