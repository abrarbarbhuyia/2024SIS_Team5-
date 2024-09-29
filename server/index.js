const express = require('express')
const cors = require('cors');
const {testConnection} = require('./databaseMaster');
const app = express();
const port = 4000;
const searchRoutes = require('./routes/search');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const restaurantRoutes = require('./routes/restaurant');

const corsOptions = {
  origin: '*',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));
app.use('/search', searchRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/restaurant', restaurantRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await testConnection();
})