const { callGeminiJSON } = require("./gemini");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Takes in a menu string (from OCR) and converts it into a JSON list of menu items extracted from the string
async function getMenuImage(body) {
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

async function getMealDetails(query){
  const prompt = 'In a JSON object response, create an object that stores the menu details with the following fields: menu item, description and price based on the menu string ${query}. This is from an OCR reading, do your best to extract actual menu items, its description and its price from this OCR string. The different menu items should be under "menu_items". Do not include your answer inside a string, just a JSON Code block.`'
  return callGeminiJSON(prompt);
}

// Takes in a query (menu) and returns a JSON Object that contains eaach ingredient and its associated allergens.
async function getIngredientDetails(query) {
  const dietaryRequirements =
  "ALCOHOL,CELERY,CRUSTACEAN,DAIRY,DASH,EGG,FISH,FODMAP,GLUTEN,IMMUNO_SUPPORTIVE,NON_KETO_FRIENDLY,NON_KIDNEY_FRIENDLY,KOSHER,HIGH_POTASSIUM,HIGH_SUGAR,LUPINE,MEDITERRANEAN,MOLLUSK,MUSTARD,OIL_ADDED,NON_PALEO_FRIENDLY,PEANUT,NON_PESCATARIAN,PORK,RED_MEAT,SESAME,SHELLFISH,SOY,SULPHITE,TREE_NUT,NON_VEGAN,NON_VEGETARIAN,WHEAT";

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
        return response.data[0];
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
  const mealId = body.mealId;

  let dietTracker = {
    "ALCOHOL": "ALCOHOL_FREE",
    "CELERY": "CELERY_FREE",
    "CRUSTACEAN": "CRUSTACEAN_FREE",
    "DAIRY": "DAIRY_FREE",
    "DASH": "DASH_FREE",
    "EGG": "EGG_FREE",
    "FISH": "FISH_FREE",
    "FODMAP": "FODMAP_FREE",
    "GLUTEN": "GLUTEN_FREE",
    "NON_IMMUNO_SUPPORTIVE": "IMMUNO_SUPPORTIVE",
    "NON_KETO_FRIENDLY": "KETO_FRIENDLY",
    "NON_KIDNEY_FRIENDLY": "KIDNEY_FRIENDLY",
    "NON_KOSHER": "KOSHER",
    "HIGH_POTASSIUM": "LOW_POTASSIUM",
    "HIGH_SUGAR": "LOW_SUGAR",
    "LUPINE": "LUPINE_FREE",
    "MEDITERRANEAN": "MEDITERRANEAN_FREE",
    "MOLLUSK": "MOLLUSK_FREE",
    "MUSTARD": "MUSTARD_FREE",
    "OIL_ADDED": "OIL_FREE",
    "NON_PALEO_FRIENDLY": "PALEO_FRIENDLY",
    "PEANUT": "PEANUT_FREE",
    "NON_PESCATARIAN": "PESCATARIAN_FRIENDLY",
    "PORK": "PORK_FREE",
    "RED_MEAT": "RED_MEAT_FREE",
    "SESAME": "SESAME_FREE",
    "SHELLFISH": "SHELLFISH_FREE",
    "SOY": "SOY_FREE",
    "SULPHITE": "SULPHITE_FREE",
    "TREE_NUT": "TREE_NUT_FREE",
    "NON_VEGAN": "VEGAN_FRIENDLY",
    "NON_VEGETARIAN": "NON_VEGETARIAN_FRIENDLY",
    "WHEAT": "WHEAT_FREE"
  };


  //Do a get call to return all MealIngredients with the given Meal Id
  let mealIngredients;
  try {
    const response = await axios.get(
      process.env.BACKEND_URL + `/mealIngredient/getMealIngredient/${mealId}`
    );
    //If it exists (Response array is longer than 1), do not post and continue to next iteration
    if (response.data.length > 0) {
      console.log("Found meal ingredients: ", response.data);
      mealIngredients = response.data;
    }
    else {
      console.log("Ingredient does not exist")
    }
  } catch (error) {
    console.error(error.message);
  }

  //For each returned mealIngredient, get the allergens from each associated ingredient, and remove them from the hashmap
  for (let i = 0; i < mealIngredients.length; i++) {
    // Do a get call to get the allergens from the ingredient
    let ingredient;
    try {
      const response = await axios.get(
        process.env.BACKEND_URL + `/ingredient/getIngredient/${mealIngredients[i].ingredientId}`
      );
      //If it exists (Response array is longer than 1), do not post and continue to next iteration
      if (response.data.length > 0) {
        console.log("Found ingredient: ", response.data);
        ingredient = response.data[0];
      }
      else {
        console.log("Ingredient does not exist")
      }
    } catch (error) {
      console.error(error.message);
    }

    // Remove from the tracker
    for (let j = 0; j < ingredient.allergens.length; j++) {
      // delete from diet tracker if it exists
      if (ingredient.allergens[j] in dietTracker) {
        delete dietTracker[ingredient.allergens[j]];
      }
    }
    console.log(dietTracker);
  }

  const dietTrackerArray = Object.values(dietTracker);
  
  const requestBody = {diet: dietTrackerArray}
  console.log("tracker array = ", dietTrackerArray);

  // update diet array with new set
  try {
    const response = await axios.put(
      process.env.BACKEND_URL + `/meal/editMeal/${mealId}`,
      requestBody
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { getIngredientDetails, getMeals, getMealDetails, createMeals, createMenu, createIngredient, createMealIngredient, getMenuImage, checkMenu, addDiet };

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
