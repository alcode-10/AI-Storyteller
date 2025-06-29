const express = require('express');
const router = express.Router();
const { generateStory } = require('../controllers/storygen');

router.post('/generatestoryapi', generateStory);

module.exports = router;
