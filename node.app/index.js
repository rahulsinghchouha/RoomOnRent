const express = require("express");
const app = express();
require("dotenv").config();
const User = require("./model/User");
const Products = require("./model/Products");
const productController = require("./controller/productController");
const userController = require("./controller/userController");

//cors for different different server
const cors = require('cors');

app.use(cors());

// for fetch the data from body we use the body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for json
app.use(bodyParser.urlencoded({ extended: false })) // for image and not only json data  

//multer for upload image
const multer = require('multer');
// Serve static files from the 'images' directory
    //path is inbuild we dont need to install this
    const path = require('path');
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads') //folder name
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix) //filename
    }
  })
  const upload = multer({ storage: storage });
//for connection to database
const {connect} = require("./config/database");
const { default: category } = require("../react.app/src/components/categoryList");
const { likeProducts } = require("./controller/userController");
connect();

// const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://singhrahul15737:dqU8xyLGWrKzxoSS@cluster0.mznlaof.mongodb.net/RoomOnRent");

app.get('/',(req,res)=>{
    res.send("Hello world")
})

//add product API for a single image single and for multiple image we use fields
app.post('/add-products',upload.fields([{name:'productImage'},{name:'productImage2'}]),productController.addProduct)
//get api product
app.get('/get-products',productController.getProduct);
//like products
app.post('/like-product',userController.likeProducts);
//for get the liked Product products jb kuchh data ko bhejna hai to hm post ka use krenge t
// then data ko find kr lenge
app.post('/liked-products',userController.likedProducts);
//My - Products
app.post('/my-products',productController.myProducts);
//get Product Details when we pass the id so we need /:id
app.get('/product-Details/:productId',productController.getProductById);
//for my profile
app.get('/my-profile/:userId',userController.myProfileById);
//ab hm search ke liye data backend se lenge
app.get('/search', productController.search)
//get user by id 
app.get('/get-user/:uId',userController.getUserById);
app.post('/signup', userController.signUp);
//login api
app.post('/login', userController.login);



//for print something on browser
app.listen(process.env.PORT,()=>{
    console.log(`Example app listening on port ${process.env.PORT}`)
})




