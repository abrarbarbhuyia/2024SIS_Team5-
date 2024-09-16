const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const { testConnection } = require('./databaseMaster');
const { getMenu } = require('./menu');
const { testSuggestic, getIngredientDetails, getMeals, createMeals, createMenu, createIngredient, createMealIngredient } = require('./allergenMaster');
const mealRoutes = require('./routes/meal');
const menuRoutes = require('./routes/menu');
const ingredientRoutes = require('./routes/ingredient');
const mealIngredientRoutes = require('./routes/mealIngredient');
const { runTests } = require('./allergenTest');

app.use(cors());
app.use(express.json());
app.use('/meal', mealRoutes);
app.use('/menu', menuRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/mealIngredient', mealIngredientRoutes);

app.get('/api/menu', async (req, res) => {
  try {
    const menuImage = await getMenu();
    res.json(menuImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  await testConnection();
  // await runTests();
  console.log(`Example app listening on port ${port}`);
});
