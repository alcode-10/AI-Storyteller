const express = require('express')
const router = express.Router();
const { getprofile, incrementDownloads } = require('../controllers/user');

router.get('/profile' , getprofile)
router.post('/download', incrementDownloads);
module.exports = router;
