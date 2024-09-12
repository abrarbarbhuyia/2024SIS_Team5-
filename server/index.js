const express = require('express')
const cors = require('cors');
const {testConnection} = require('./databaseMaster');
const app = express();
const port = 4000;
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');

const corsOptions = {
  origin: '*',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await testConnection();
})