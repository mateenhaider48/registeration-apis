const mongoose = require('mongoose');

const productScheema = mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        color:{
            type:String,
            required:true
        },
        ram:{
            type:Number,
            required:true
        },
        emi:{
            type:Number,
            required:true,
            unique:true
        }
})


const productModal = mongoose.model("product",productScheema);

module.exports = productModal;