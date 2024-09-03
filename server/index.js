const express = require('express')
const app = express()
const port = 4000
const {testConnection} = require('./databaseMaster');
const tesseract = require('tesseract.js');
const imagePath = "";
const { dbOp } = require('./databaseMaster');


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/tesseract', (req, res) => {
    tesseract.recognize( imagePath, 'eng')
  .then(({ data: { text } }) => {

      res.send(text);
  })
  .catch(err => {
      console.error(err);
  });
})

app.get('/tesseract_db', async (req, res) => {
  try {
    const { data: { text } } = await tesseract.recognize(imagePath, 'eng');
    const document = [{ name: text }];

    await dbOp('insert', 'Test', { docs: document });
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await testConnection();
})