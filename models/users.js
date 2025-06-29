const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    prompts:{
        type:Number,default:0
    },
    downloads:{
        type:Number,default:0
    },
     merges:{
        type:Number,default:0
    }
})
module.exports = mongoose.model('User',user)