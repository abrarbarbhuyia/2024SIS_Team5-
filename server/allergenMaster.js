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
async function getMeals(query) {
  const prompt = `In a JSON object response, provide seperate menu items based on the following menu string ${query}. Do not categorise the items at all, and ignore all other information. The different menu items should be under "menu_items". Do not include your answer inside a string, just a JSON Code block.`;
  return callGeminiJSON(prompt);
}

// Takes in a query (menu) and returns a JSON Object that contains eaach ingredient and its associated allergens.
async function getIngredientDetails(query) {
  const dietaryRequirements =
    "ALCOHOL_COCKTAIL,ALCOHOL,CELERY,CRUSTACEAN,DAIRY,DASH,EGG,FISH,FODMAP,GLUTEN,IMMUNO_SUPPORTIVE,KETO_FRIENDLY,KIDNEY_FRIENDLY,KOSHER,LOW_POTASSIUM,LOW_SUGAR,LUPINE,MEDITERRANEAN,MOLLUSK,MUSTARD,NO_OIL_ADDED,PALEO,PEANUT,PESCATARIAN,PORK,RED_MEAT,SESAME,SHELLFISH,SOY,SUGAR_CONSCIOUS,SULPHITE,TREE_NUT,VEGAN,VEGETARIAN,WHEAT";

  const prompt = `In only a JSON object response, provide the ingredients for ${query}, inside each ingredient, map a list of allergens to each ingredient. Given these allergens come from the following list ${dietaryRequirements}. Do not include your answer inside a string, just a JSON Code block.`;
  return callGeminiJSON(prompt);
}

// Takes in the meals JSON object and creates the meals in the database
async function createMeals(body) {
  // access array by doing uperHeroes["members"][1]["powers"][2];
  const JSONbody = JSON.parse(body);
  const menuItems = JSONbody.menu_items;
  console.log(body.menu_items);

  //Extract each menu item and post in a loop
  menuItems.forEach(async (item) => {
    const requestBody = {
      mealId: 1,
      name: item,
      diet: ["test"],
      menuId: 2,
    };
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + `/createMeal/`,
        requestBody
      );
      console.log("Create Meal Reponse: ", response.data);
    } catch (error) {
      console.error(error);
    }
  });
  // mealId: req.body.mealId, - we need to generate this
  // name: req.body.name, - we have this
  // diet: req.body.diet, - we can get this but it's inside of getIngredientDetails (maybe populate with an update?)
  // menuId: req.body.menuId - we need to generate this or get thiss
}

module.exports = { testSuggestic, getIngredientDetails, getMeals, createMeals };
