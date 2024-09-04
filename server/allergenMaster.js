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
      console.error('Error fetching data:', error);
    }
  }
  
  module.exports = { testSuggestic };
  