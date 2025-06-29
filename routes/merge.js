const express = require('express');
const router = express.Router();
const { mergeVoices } = require('../controllers/mergevoice');

router.post('/merge', mergeVoices);

module.exports = router;
