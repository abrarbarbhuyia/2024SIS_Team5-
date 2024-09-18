const { callGeminiJSON } = require("./gemini");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

async function testSuggestic(query) {
  require("isomorphic-fetch");

  try {
    const response = await fetch("https://production.suggestic.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.SUGGESTIC_API_KEY}`,
      },
      body: JSON.stringify({
        query: `
            {
              searchRecipeByNameOrIngredient(query: "${query}") {
                onPlan {
                  id
                  name
                  author
                  adherence
                  ingredients {
                    name
                  }
                }
                otherResults {
                  id
                  name
                  author
                  adherence
                  ingredients {
                    name
                  }
                }
              }
            }`,
      }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON response
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Takes in a menu string (from OCR) and converts it into a JSON list of menu items extracted from the string
async function getMenuImage(body) {
  // temp hard coded id
  // const JSONbody = JSON.parse(body);
  const restaurantId = body.restaurantId;
  
  try {
    const response = await axios.get(
      process.env.BACKEND_URL + `/menu/getMenuString/${restaurantId}`
    );
    console.log("Menu String: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }  
}

// Takes in a menu string (from OCR) and converts it into a JSON list of menu items extracted from the string
async function getMeals(query) {
  const prompt = `In a JSON object response, provide seperate menu items based on the following menu string ${query}. This is from an OCR reading, do your best to extract actual menu items from this OCR string. Do not categorise the items at all, and ignore all other information. The different menu items should be under "menu_items". Do not include your answer inside a string, just a JSON Code block.`;
  return callGeminiJSON(prompt);
}

// Takes in a query (menu) and returns a JSON Object that contains eaach ingredient and its associated allergens.
async function getIngredientDetails(query) {
  const dietaryRequirements =
    "ALCOHOL_COCKTAIL,ALCOHOL,CELERY,CRUSTACEAN,DAIRY,DASH,EGG,FISH,FODMAP,GLUTEN,IMMUNO_SUPPORTIVE,KETO_FRIENDLY,KIDNEY_FRIENDLY,KOSHER,LOW_POTASSIUM,LOW_SUGAR,LUPINE,MEDITERRANEAN,MOLLUSK,MUSTARD,NO_OIL_ADDED,PALEO,PEANUT,PESCATARIAN,PORK,RED_MEAT,SESAME,SHELLFISH,SOY,SUGAR_CONSCIOUS,SULPHITE,TREE_NUT,VEGAN,VEGETARIAN,WHEAT";

  const prompt = `In only a JSON object response, provide the ingredients for ${query}, inside each ingredient, map a list of allergens to each ingredient. Given these allergens come from the following list ${dietaryRequirements}. Do not include your answer inside a string, just a JSON Code block. Be very accurate with the ingredients you list, ensuring to take inspiration from the dish name. Do not list the amount of ingredients, simply identify them. Structure the JSON so that it is exactly like {ingredients: [{name:"", allergens:[]}, and so on]} RETURN A JSON AND PUT ALL THIS UNDER INGREDIENTS:`;
  return callGeminiJSON(prompt);
}

// Takes in a restaurant ID and checks if the menu exists, otherwise, performs OCR to get menu string and populates it in DB with createMenu() func.
async function checkMenu(restaurantId) {
  //Check if the menu already exists in the DB
  try {
    const response = await axios.get(
      process.env.BACKEND_URL + `/menu/getMenu/${restaurantId}`
    );
    //If it exists (Response array is longer than 1), do not post and continue to next iteration
    if (response.data.length > 0) {
      console.log("Menu already exists: ", response.data);
      return true;
    } else {
      console.log("Menu does not exist!");
      return false;
    }
  } catch (error) {
    console.error(error.message);
  }  
}

//Takes in menu and restaurant Ids to create a menu object in the database
async function createMenu(body) {
  // Still not sure how this model fits into other areas 
  
  // Need to get restaurant ID from foursquare
  // const restaurantId = "1"
  //Need to also check if a menu exists by looking at restaurant ids first
  
  const requestBody = {
    restaurantId: body.restaurantId,
    menuString: body.menuString,
  }

  try {
    const response = await axios.post(
      process.env.BACKEND_URL + `/menu/createMenu/`,
      requestBody
    );
    console.log("Created Menu: ", response.data);
    return response.data
  } catch (error) {
    console.error(error.message);
  }
}

// Takes in the meals JSON object and creates the meals in the database
async function createMeals(body) {
  const menuItems = body.menuItems;
  const menuId = body.menuId;
  let mealIdArray = [];
  console.log(body);

  //Extract each menu item in a loop, check if it exists. If not, post it. 
  for (let i = 0; i < menuItems.length; i++) {
    const requestBody = {
      name: menuItems[i],
      menuId: menuId,
    };

    //Before posting, check if the menuItem already exists in the DB
    try {
      const response = await axios.get(
        process.env.BACKEND_URL + `/meal/getMealByName/${requestBody.name}`,
        requestBody
      );
      //If it exists (Response array is longer than 1), do not post and continue to next iteration
      if (response.data.length > 0) {
        console.log("Menu item already exists: ", response.data);
        mealIdArray.push(response.data.mealId);
        continue;  
      }
    } catch (error) {
      console.error(error.message);
    }

    //After checking, post menu items that do not already exist
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + `/meal/createMeal/`,
        requestBody
      );
      console.log("Created Menu Item: ", response.data);
      mealIdArray.push(response.data.mealId);
    } catch (error) {
      console.error(error.message);
    }
  }
  return mealIdArray;
}


// Takes in ingredient name and allergens and creates the ingredient in the database
async function createIngredient(body) {
  const name = body.name;
  const allergens = body.allergens;
  // console.log();

    const requestBody = {
      name: name,
      allergens: allergens
    };

    //Before posting, check if the ingredient already exists in the DB
    try {
      const response = await axios.get(
        process.env.BACKEND_URL + `/ingredient/getIngredientByName/${requestBody.name}`
      );
      //If it exists (Response array is longer than 1), do not post and continue to next iteration
      if (response.data.length > 0) {
        console.log("Ingredient item already exists: ", response.data);
        return response.data;
      }
    } catch (error) {
      console.error(error.message);
    }

    //After checking, post ingredients that do not already exist
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + `/ingredient/createIngredient/`,
        requestBody
      );
      console.log("Created Ingredient Item: ", response.data);
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
}

// After front-end is developed, this function will be called
async function createMealIngredient(body) {
  const mealId = body.mealId;
  const ingredientId = body.ingredientId;

  const requestBody = {
    mealId: mealId,
    ingredientId: ingredientId
  };

  //Before posting, check if the meal ingredient already exists in the DB
  try {
    const response = await axios.get(
      process.env.BACKEND_URL + `/mealIngredient/getMealIngredient/${requestBody.mealId}`,
      requestBody
    );
    //If it exists (Response array is longer than 1), do not post and continue to next iteration
    if (response.data.length > 0) {
      console.log("MealIngredient item already exists: ", response.data);
    }
  } catch (error) {
    console.error(error.message);
  }

  //After checking, post meal ingredients that do not already exist
  try {
    const response = await axios.post(
      process.env.BACKEND_URL + `/mealIngredient/createMealIngredient/`,
      requestBody
    );
    console.log("Created MealIngredient Item: ", response.data);
  } catch (error) {
    console.error(error.message);
  }
}

async function addDiet(body) {
  
}

module.exports = { testSuggestic, getIngredientDetails, getMeals, createMeals, createMenu, createIngredient, createMealIngredient, getMenuImage, checkMenu };

/*
 Flow:
  FRONTEND
   1) User searches with filters
  BACKEND
   2) Call Foursquare API to get restaurants in current location (hard coded)
   3) Check if restaurants exist in DB, if not, save their data to the DB.
   4) Check if restaurants have an associated menu object. 
      a) If yes -> Assume menu, meals and ingredients already exist. END
      b) If no -> Go to step 5
   5) Create menu object with Foursquare restaurant id. --> createMenu function
   6) Call Foursquare menu api with provided FSQid to retrieve menu image/s.
      a) If menu found -> Run OCR on it
      b) If no menu found -> Manual upload -> Run OCR on it
   7) Call Gemini to clean up OCR into list of menuItems --> getMeals function
   8) Check if menuItems exist in DB --> createMeals function
      a) If yes -> Continue
      b) If no -> Create menuItems that do not exist (With menu id)
   9) For each menuItem, get the list of ingredients from Gemini --> getIngredientDetails
   10) Check if ingredients exist in DB --> createIngredients function
      a) If yes -> Continue
      b) If no -> Create ingredients that do not exist
   11) Create mealIngredient (with corresponding meal and ingredient ids) - needs to be integrated when we start geenrating IDs.
*/
