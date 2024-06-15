const mongoose = require("mongoose");

const User = mongoose.Schema({
 username:{
    type:String,
    //required:true
 },
 mobile:{
   type:String,
   //required:true
},
email:{
   type:String,
   //required:true
},
 password:{
    type:String,
 //   required:true
 },
 //liked product ka array hoga
 likedProducts:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Products",
 }]

})

module.exports = mongoose.model("User",User);