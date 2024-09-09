const { GoogleGenerativeAI } = require("@google/generative-ai");

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

async function testGemini(query) {
  // Make sure to include these imports:
  // import { GoogleGenerativeAI } from "@google/generative-ai";
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const dietaryRequirements =
    "ALCOHOL_COCKTAIL,ALCOHOL,CELERY,CRUSTACEAN,DAIRY,DASH,EGG,FISH,FODMAP,GLUTEN,IMMUNO_SUPPORTIVE,KETO_FRIENDLY,KIDNEY_FRIENDLY,KOSHER,LOW_POTASSIUM,LOW_SUGAR,LUPINE,MEDITERRANEAN,MOLLUSK,MUSTARD,NO_OIL_ADDED,PALEO,PEANUT,PESCATARIAN,PORK,RED_MEAT,SESAME,SHELLFISH,SOY,SUGAR_CONSCIOUS,SULPHITE,TREE_NUT,VEGAN,VEGETARIAN,WHEAT";

  const prompt = `In only a JSON object response, provide the ingredients for ${query}, inside each ingredient, map a list of allergens to each ingredient. Given these allergens come from the following list ${dietaryRequirements}`;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

module.exports = { testSuggestic, testGemini };
