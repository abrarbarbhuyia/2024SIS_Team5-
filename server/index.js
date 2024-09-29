const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const { testConnection } = require('./databaseMaster');
const { testSuggestic, getIngredientDetails, getMeals, createMeals, createMenu, createIngredient, createMealIngredient, getMenuImage } = require('./allergenMaster');
const mealRoutes = require('./routes/meal');
const menuRoutes = require('./routes/menu');
const ingredientRoutes = require('./routes/ingredient');
const mealIngredientRoutes = require('./routes/mealIngredient');
const restaurantRoutes = require('./routes/restaurant.js');
const { runTests } = require('./allergenTest');


const corsOptions = {
  origin: '*',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/meal', mealRoutes);
app.use('/menu', menuRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/mealIngredient', mealIngredientRoutes);
app.use('/restaurant', restaurantRoutes);


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
  //await runTests();
  console.log(`Example app listening on port ${port}`);
});
