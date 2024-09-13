require('dotenv').config();

const axios = require('axios');
const Tesseract = require('tesseract.js');

async function getMenu(){
    const placeId = '4e4a1510483b16676e3a760f';
    const url = `https://api.foursquare.com/v3/places/${placeId}/photos?classifications=menu`;
    
  
    try {
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
        return (menu_string);
    } catch (error) {
        console.error(error);
        throw new Error('Menu was not found!');
    }
}

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

    if (commonKeywordCount >= 1 && priceCount >= 1) {
        console.log("Item is a menu");
        return true;
    }

    console.log("Item is not a menu");
    return false;
}

module.exports = { getMenu }