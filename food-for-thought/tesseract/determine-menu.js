const Tesseract = require('tesseract.js');
const fs = require('fs');
const sharp = require('sharp');
//const { Jimp } = require("jimp");

async function extractTextFromImage(imagePath) {
    try {
        
        const result1 = await sharp(imagePath)
        //convert the image to gray scale and black & white space
        .grayscale()
        .toColourspace('b-w')
        //increase DPI to 350
        .withMetadata({ density: 350 })
        //resize the image 
        .resize({
            fit: sharp.fit.contain,
            width: 1000,

        })
        //sharpen the image for better contrast
        .sharpen({
            sigma: 2,
            flat: 0.9
        })
        //output to file
        .toFile('output-image1.jpg')

       /*
        const image = await Jimp.read(imagePath)
        //convert to gray scale
        image.greyscale()
        image.write("output-image.jpg")
        image.resize(1000, Jimp.AUTO)
*/
 
        const result = await Tesseract.recognize('output-image.jpg', 'eng');
        const extractedText = result.data.text;
        console.log(extractedText); // Print the extracted text
        return extractedText;
    } catch (error) {
        console.error("Error extracting text:", error);
        return '';
    }
}

// Function to determine if the text represents a menu
function isMenu(extractedText) {
    const commonKeywords = ['appetizers', 'appetizer', 'main course', 'desserts', 'starters',
                            'salads', 'drinks', 'entrees', 'sides', 'beverages', 'soups', 
                            'mains', 'lunch', 'menu', 'vegetables', 'main', 'breakfast', 'beverage', 'side', 'sides', 'seafood', 'entree', 'meat', 'noodles'];
    
    // Regular expression for price pattern
    const pricePattern = /\$\d+(\.\d{2})?/g;
    //const pricePattern = /d+(\.\d{2})?/g;
    const textLower = extractedText.toLowerCase();
    const commonKeywordCount = commonKeywords.reduce((count, keyword) => {
        return count + (textLower.includes(keyword) ? 1 : 0);
    }, 0);

    const priceCount = (textLower.match(pricePattern) || []).length;

    if (commonKeywordCount >= 1 && priceCount >= 3) {
        console.log("Item is a menu");
        return true;
    }

    console.log("Item is not a menu");
    return false;
}

// FOR TESTING
const imagePath = "";
extractTextFromImage(imagePath).then((extractedText) => {
    console.log("Extracted Text:");
    console.log(extractedText);
    isMenu(extractedText);
});
