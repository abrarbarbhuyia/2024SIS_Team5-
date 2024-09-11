const express = require('express')
const app = express()
const port = 4000
const {testConnection} = require('./databaseMaster');
const {testSuggestic, getIngredientDetails, getMeals} = require('./allergenMaster');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await testConnection();
  // await testSuggestic("STEAM BBQ BUN");
  console.log(await getMeals("FOOD MENU Paucek and Lage Restaurant MAIN COURSE Cheeseburger — $34 Cheese sandwich — $22 Chicken burgers — $23 Spicy chicken — $33 Hot dog — $24 APPETIZERS Fruit Salad — $13 Cocktails — $12 Nuggets — $14 Sandwich — $13 French Fries — $15 BEVERAGES Milk Shake — $3 Iced Tea — $2 Orange Juice — $4 Lemon Tea — $3 Coffee — $5 123-456-7890 123 Anywhere St., Any City"));
  console.log(await getIngredientDetails("Pad see ew"));
})