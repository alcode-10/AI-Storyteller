const express = require('express');
const router = express.Router();
const { stories } = require('../stories'); //DESTRUCTURE correctly

router.get('/stories', (req, res) => {
  res.json({ stories }); 
});

module.exports = router;
