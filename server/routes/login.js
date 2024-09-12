const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
   console.log('hello');
   res.send('hello');
});

module.exports = router;