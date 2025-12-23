const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    otp:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,   
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:  600
    }
})


const otpModal = mongoose.model("otp",otpSchema);

module.exports = otpModal;