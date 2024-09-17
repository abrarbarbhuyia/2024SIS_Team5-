const {
  createIngredient,
  createMealIngredient,
  createMeals,
  createMenu,
  getIngredientDetails,
  getMeals,
  getMenuImage,
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

async function runTests() {
  try {
    // await testCreateMenu();
    // await testgetMeals();
    // await testCreateMeals();
    // await testGetIngredientDetails();
    // await testCreateIngredient();
    // await testCreateMealIngredient();
    await testgetMenuImage();
  } catch (error) {
    console.error("An error occured during testing", error);
  }
}

// Execute tasks
runTests().catch(console.error);

module.exports = { runTests };
