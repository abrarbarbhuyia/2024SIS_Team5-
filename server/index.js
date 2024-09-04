const express = require('express')
const app = express()
const port = 4000
const {testConnection} = require('./databaseMaster');
const {testSuggestic} = require('./allergenMaster');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await testConnection();
  await testSuggestic("STEAM BBQ BUN");
})