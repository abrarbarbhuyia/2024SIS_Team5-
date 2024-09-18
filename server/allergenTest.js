const {
  checkMenu,
  createIngredient,
  createMealIngredient,
  createMeals,
  createMenu,
  getIngredientDetails,
  getMeals,
  getMenuImage,
  addDiet,
} = require("./allergenMaster");
const menuString =
  "Mango Lush, Salt Lassi, Cokamint Crush Detox, Mixed Fruit Saruwath, Faluda, Elephant House Sri Lankan Soft Drinks, Ginger Beer, Cream Soda, Necto, Orange Crush, Coca-Cola, Coke No Sugar, Diet Coke, Fanta, Sprite, Lemon Lime Bitters, Plunger Coffee Infused with Cardamom Pods, Masala Tea, Ceylon Black Tea, Cinnamon Tea, Jasmine Green Tea, Hot Butter Calamari, Chilli Garlic Prawns, Sri Lankan Fish Pan Rolls, Cutlets, Chicken Pan Roll, Vegetarian Pan Rolls, Combination of Red and White String Hoppers";
const mealString = "pad see ew";

const mealIngredientObject = {
  mealId: "1",
  ingredientId: "2",
};

async function testCreateMenu() {
  try {
    await createMenu(menuString);
    console.log("Create Menu function passed");
  } catch (error) {
    console.log("Create Menu function failed", error);
  }
}

async function testgetMeals() {
  try {
    const mealsBody = await getMeals(menuString);
    console.log("Get Meals function passed", mealsBody);
  } catch (error) {
    console.log("Get Meals function failed", error);
  }
}

async function testCreateMeals() {
  try {
    const mealsBody = await getMeals(menuString);
    await createMeals(mealsBody);
    console.log("Create Meals function passed");
  } catch (error) {
    console.log("Create Meals function failed", error);
  }
}

async function testGetIngredientDetails() {
  try {
    await getIngredientDetails(mealString);
  } catch (error) {
    console.log("Get Ingredient Details function failed", error);
  }
}

async function testCreateIngredient() {
  try {
    const ingredientsBody = await getIngredientDetails(mealString);
    await createIngredient(ingredientsBody);
    console.log("Create Ingredients function passed");
  } catch (error) {
    console.log("Create Ingredients function failed", error);
  }
}

async function testCreateMealIngredient() {
  try {
    await createMealIngredient(mealIngredientObject);
  } catch (error) {
    console.log("Create meal ingredient function failed", error);
  }
}

async function testgetMenuImage() {
  const menuString = await getMenuImage("Temp");
  const meals = await getMeals(menuString);
  const JSONbody = JSON.parse(meals);
  const mealItems = JSONbody.menu_items;
  console.log(mealItems);
  for (const meal of mealItems) {
    console.log(meal);
    console.log(await getIngredientDetails(meal));
  }
}

async function testFlow() {
  //Check if Restaurant exists - Create if not exists (Foursquare fsqid info) - Pending
  //Right now, restaurant exists with id = '4e4a1510483b16676e3a760f'
  // Check if menu exists with given restaurant id
  const restaurantId = "4e4a1510483b16676e3a760f";
  const menuExists = await checkMenu(restaurantId);
  if (!menuExists) {

    // menu does not exist we can proceed
    const menuStringRequestBody = {restaurantId: restaurantId}
    const menuString = await getMenuImage(menuStringRequestBody);

    // // create menu
    const createMenuRequestBody = {restaurantId: restaurantId, menuString: menuString};
    const menu = await createMenu(createMenuRequestBody);
    console.log(menu);

    // get meals
    //Returns JSON {menu_items : ["saddam", "hussein"]}
    const JSONMenuItems = JSON.parse(await getMeals(menuString));
    const menuItems = JSONMenuItems.menu_items;
    console.log(menuItems);

    // create meals in db
    const createMealsRequestBody = {menuItems: menuItems, menuId: menu.menuId};
    const mealIdArray = await createMeals(createMealsRequestBody); //We will need to get meal id from here -> For meal ingredient    
    console.log(mealIdArray);

    // get ingredients and create ingredient at the same time
    for (let i = 0; i < menuItems.length; i++) {
      const ingredientDetails = await getIngredientDetails(menuItems[i]);
      const JSONIngredients = JSON.parse(ingredientDetails);
      const mealId = mealIdArray[i];
      for (let j = 0; j < JSONIngredients.ingredients.length; j++) {
        const createIngredientRequestBody = {name: JSONIngredients.ingredients[j].name, allergens: JSONIngredients.ingredients[j].allergens}
        // grab ingredient for mealIngredient creation
        const ingredient = await createIngredient(createIngredientRequestBody);
        // grab mealId for mealIngredient creation
        // create mealingredient object
        const mealIngredientRequestBody = {ingredientId: ingredient.ingredientId, mealId: mealId};
        await createMealIngredient(mealIngredientRequestBody);
      }
      // add diet logic
      const addDietRequestBody = {mealId: mealId};
      await addDiet(addDietRequestBody);
    }
    
  }
}

async function runTests() {
  try {
    // await testCreateMenu();
    // await testgetMeals();
    // await testCreateMeals();
    // await testGetIngredientDetails();
    // await testCreateIngredient();
    // await testCreateMealIngredient();
    // await testgetMxenuImage();
    await testFlow();
  } catch (error) {
    console.error("An error occured during testing", error);
  }
}

module.exports = { runTests};
