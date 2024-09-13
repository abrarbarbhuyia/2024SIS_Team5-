require('dotenv').config();
const express = require('express');
const router = express.Router();
const Menu = require('../models/menuModel');
const databaseMaster = require('../databaseMaster');
const axios = require('axios');
const Tesseract = require('tesseract.js');


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
        const menu = new Menu({
            menuId: req.body.menuId,
            restaurantId: req.body.restaurantId
        });
        await databaseMaster.dbOp('insert', 'MenuDetails', { docs: [menu] });
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

router.get('/getMenuString/:menuId', async(req,res) => {
    const placeId = req.params.menuId;
    //const placeId = '4e4a1510483b16676e3a760f';
    const url = `https://api.foursquare.com/v3/places/${placeId}/photos?classifications=menu`;
    
  
    try {
        //retrieve menu images by calling foursquare's place photo request using the menu id
        const response = await axios.get(url, {
            headers: {
                Authorization: `${process.env.FOURSQUARE_API_KEY}`
            }
        });
        var menu_string = "";
        const place_photo_array = response.data
        for (let i = 0; i < place_photo_array.length; i++) 
            {
              const menu_image = place_photo_array[i];
              //concatenate the menu_url_string to "prefix" + "widthxheight" + "height"
              const menu_url = menu_image.prefix + menu_image.width + "x" + menu_image.height + menu_image.suffix;
      
              //use Tesseract OCR library to convert the menu image to text
              const result = await (Tesseract.recognize(menu_url, 'eng'));
              //remove the line breaks from the resulting menu string
              const cleaned_string =   result.data.text.replace(/\n/g, ' ');
              //check if the image is an menu
              const is_menu_flag = await isMenu(cleaned_string);
              if(is_menu_flag == true) {
                //add translated text to the menu string
                menu_string += cleaned_string;
              }
            }
        console.log(menu_string);
        res.json(menu_string);
    } catch (error) {
        console.error(error);
        throw new Error('Menu was not found!');
    }
});

async function isMenu(extractedText) {
    const commonKeywords = ['appetizers', 'appetizer', 'appetiser', 'appetisers', 'main course', 'dessert',  'desserts', 'starter',  'starters',
                            'salads', 'drink', 'drinks', 'entree', 'entrees', 'side',  'sides', 'beverage', 'beverages', 'soup', 'soups', 'main',
                            'mains', 'lunch', 'menu', 'vegetables',  'breakfast', 'seafood', 'meat', 'noodle', 'noodles'];
    
    // Regular expression for price pattern
    const pricePattern = /\d+(\.\d{2})?/g;
    const textLower = extractedText.toLowerCase();
    const commonKeywordCount = commonKeywords.reduce((count, keyword) => {
        return count + (textLower.includes(keyword) ? 1 : 0);
    }, 0);

    const priceCount = (textLower.match(pricePattern) || []).length;

    //check for at least one price and common keyword in the text do determine it is a menu
    if (commonKeywordCount >= 1 && priceCount >= 1) {
        console.log("Item is a menu");
        return true;
    }

    console.log("Item is not a menu");
    return false;
}

module.exports = router;