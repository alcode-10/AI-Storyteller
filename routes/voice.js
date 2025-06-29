const express = require('express')
const router=express.Router()
const { generatevoices }= require('../controllers/voicecontrol')
const {mergeVoices}=require('../controllers/mergevoice')
router.post('/generate-voices',generatevoices)

module.exports=router;