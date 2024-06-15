const mongoose = require("mongoose");

const Products = mongoose.Schema({
 productName:{
    type:String,
    //required:true
 },
 productDesc:{
    type:String,
 //   required:true
 },
 price:{
    type:String
 },
 category:{
    type:String,
 },
 productImage:{
    type:String //isme hm path ko store krenge
 },
 productImage2:{
   type:String //isme hm path ko store krenge
},
 addedBy:{
   type:mongoose.Schema.Types.ObjectId,
 }
})
module.exports = mongoose.model("Products",Products);