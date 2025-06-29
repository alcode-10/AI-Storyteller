const express = require('express')
const session = require('express-session')
const axios=require('axios')
const cors = require('cors')
require('dotenv').config();
const path=require('path')
const mongoose = require('mongoose')
const stories = require('./stories')


//routes
const storyRoute = require('./routes/story')
const mergeVoices = require('./routes/merge')
const storyRoutesApi = require('./routes/storyroute')
const auth = require('./routes/auth');
const profile = require('./routes/profile')
const voiceRoutes = require('./routes/voice');

const app =express()//http requests

//middleware
app.use(cors())//enables cors for my server
app.use(express.json()) //parse in json format

app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false,
}))

//static client files
app.use(express.static(path.join(__dirname, 'client')));//include all static files
// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

app.get('/', (req, res) => {
  res.redirect('/signup.html');
})

//api routes

app.use('/api', voiceRoutes);
app.use('/api', storyRoute);
app.use('/api', mergeVoices);
app.use('/api', storyRoutesApi);
app.use('/api/auth',auth)
app.use('/api/user',profile)

//session destroy
app.get('/signup.html', (req, res) => {
  req.session.destroy(() => {
    res.sendFile(path.join(__dirname, 'client', 'signup.html'));
  });
});

app.get('/login.html', (req, res) => {
  req.session.destroy(() => {
    res.sendFile(path.join(__dirname, 'client', 'login.html'));
  });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.once('open',()=>{
    console.log('Connected to MONGODB');
    app.listen(PORT, () =>{
    console.log(`server is running on port : ${PORT}`)
});

});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


