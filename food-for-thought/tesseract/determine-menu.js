const Tesseract = require('tesseract.js');
const fs = require('fs');

async function extractTextFromImage(imagePath) {
    try {
        const result = await Tesseract.recognize(imagePath, 'eng');
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
                            'mains', 'lunch', 'menu', 'vegetables'];
    
    // Regular expression for price pattern
    const pricePattern = /\$\d+(\.\d{2})?/g;
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
