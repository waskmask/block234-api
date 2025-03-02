const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    status:{
        type:Array,
        required:true
    }
},
{
     timestamps: true 
})


module.exports = mongoose.model('verification',verificationSchema) ;