const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const searchRoutes = require('./routes/search');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const { testConnection } = require('./databaseMaster');
const {getIngredientDetails, getMeals, createMeals, createMenu, createIngredient, createMealIngredient, getMenuImage, getMealDetails } = require('./allergenMaster');
const mealRoutes = require('./routes/meal');
const menuRoutes = require('./routes/menu');
const ingredientRoutes = require('./routes/ingredient');
const mealIngredientRoutes = require('./routes/mealIngredient');
const restaurantRoutes = require('./routes/restaurant');
const { runTests } = require('./allergenTest');


const corsOptions = {
  origin: '*',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));
app.use('/search', searchRoutes);
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
  console.log(await getMealDetails(
    /* Test prompts with menu strings from OCR" */
    "FOOD MENU Pausek and Lage Restaurant MAIN COURSE Cheeseburger — $34 Cheese sandwich — $22 Chicken burgers — $23 Spicy chicken — $33 Hot dog — $24 APPETIZERS Fruit Salad — $13 Cocktails — $12 Nuggets — $14 Sandwich — $13 French Fries — $15 BEVERAGES Milk Shake — $3 Iced Tea — $2 Orange Juice — $4 Lemon Tea — $3 Coffee — $5 123-456-7890 123 Anywhere St., Any City"
  //  "OUR SPECIALS CURRY WHOLE FISH $38.00 (Whole snapper cooked in our specially-prepared Malaysian curry sauce) ASSAM WHOLE FISH $38.00 (Whole snapper served in a tangy and spicy tamarind sauce) KARITAN PRAWN $23.80 (Prawn served in our famous creamy curry with ground herb and spices) DRY CURRY PRAWN $23.99 (Knockout prawn dish in sambal paste and curry leaves) CEREAL PRAWN $23.80 (Prawn dish served in batter of Nestum cereal, chillies, and curry leaves) BYO CRAB $20.00 per crab (Bring your own mud crab and we'll cook them in Singapore Chili Crab or Dry Curry Crab style) SALMON SALAD 'YEE SANG' Why wait until Chinese New Year to savour our famous 'Yee Sang'? You can now order our salad of fresh salmon and vegetables all year round. (Minimum 8 persons - $12 per person)"
  ));
  //await runTests();
  console.log(`Example app listening on port ${port}`);
});
