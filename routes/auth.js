const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/authcontroller');
const {login} = require('../controllers/authcontroller');

router.get('/login', (req, res) => res.sendFile(__dirname + '/../client/login.html'));//displays the forms for signup
router.get('/signup', (req, res) => res.sendFile(__dirname + '/../client/signup.html'));//displays the form for login
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
