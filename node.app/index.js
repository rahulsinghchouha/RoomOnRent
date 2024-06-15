const express = require("express");
const app = express();
require("dotenv").config();
const User = require("./model/User");
const Products = require("./model/Products");


//cors for different different server
const cors = require('cors');

app.use(cors());

// for fetch the data from body we use the body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for json
app.use(bodyParser.urlencoded({ extended: false })) // for image and not only json data  

//json web token
const jwt = require('jsonwebtoken');

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
connect();

// const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://singhrahul15737:dqU8xyLGWrKzxoSS@cluster0.mznlaof.mongodb.net/RoomOnRent");

app.get('/',(req,res)=>{
    res.send("Hello world")
})

//add product API for a single image single and for multiple image we use fields
app.post('/add-products',upload.fields([{name:'productImage'},{name:'productImage2'}]),async(req,res)=>{
    //for check what i get from body
   
    console.log(req.files); //more than one so we use files
    console.log(req.body);

   

    //fetching the data 

    const {productName,productDesc,price,category} = req.body;
    const productImage = req.files.productImage[0].path;  //yaha hm product ki image nikal rahe hai jo ki product ki form men hai
    const productImage2 = req.files.productImage2[0].path;
    const addedBy = req.body.userId;

    //entry in database key value same to ek hee bar likh sakte hai

    const products = new Products ({productName,productDesc,price,category,productImage,productImage2,addedBy});

    await products.save()
    .then(()=>{res.send({message : 'saved success'})})
    .catch((err)=>{res.send({message: 'server err'})})
    })

//get api product
app.get('/get-products',async(req,res)=>{

    const catName = req.query.catName;

    //console.log("category--->",catName);

    let _f = {}
    if(catName)
        {
            _f={category:catName}
        }

    await Products.find(_f)
    .then((result)=>{
        console.log("user data ->",result)
        res.send({message:'data fetch succesfully',products:result})})
    .catch((err)=>{res.send({message:'server err'})})

})

app.post('/like-product',async(req,res)=>{
    let productId = req.body.productId;
    let userId = req.body.userId;
    //console.log(req.body);
    

    //ab hme user vale model ko update krna hai liked array ko jese hm sql men where ka use 
    // vese hee yaha bhi use krenge id user id ke equal honi chahiye
    //yaha pr hmara like name ka array hai to usme data add krne ke liye hm $ addToSet ka use krenge
    //likedProduct is schema name and productId we getch from body
    await User.updateOne({_id:userId},
                    {$addToSet :{likedProducts:productId}}
                    )
        .then(()=>{
            res.send({message:"like success"})
        })
        .catch((err)=>{
            res.send({message:"like server err"})
        })

})
//for get the liked Product products jb kuchh data ko bhejna hai to hm post ka use krenge t
// then data ko find kr lenge
app.post('/liked-products',async (req,res)=>{
    //liked products ko hm user ke andar se find krenge
    console.log("liked products")

    await User.findOne({_id:req.body.userId}).populate('likedProducts')
    .then((result)=>{
    console.log("user data ->",result)
    res.send({message:'data fetch succesfully',products:result.likedProducts})})
    .catch((err)=>{res.send({message:'server err'})})

})

//get Product Details when we pass the id so we need /:id
app.get('/product-Details/:productId',async(req,res)=>{
    //we can check the data using the console
    console.log(req.params);
    //ye id find out krenge jo ki product ki id hai
    //ek hee product hoga isliye findOne ka use krenge
    await Products.findOne({_id:req.params.productId})
    .then((result)=>{
        console.log("user data ->",result)
        res.send({message:'data fetch succesfully',product:result})})
    .catch((err)=>{res.send({message:'server err'})})

})

//ab hm search ke liye data backend se lenge
app.get('/search', async (req,res)=>{

    //is query ke basis pr hm result ko find out krenge
    let search = req.query.search;
    //find the data from mongodb is prakar hm mongodb se data ko find krenge
    Products.find({
        $or:[
           { productName:{$regex:search} },
           { productDesc:{$regex:search} },
           { category:{$regex:search} },
           { price:{$regex:search} },
        ]
    })
    .then((result)=>{
        console.log("user data ->",result)
        res.send({message:'data fetch succesfully',products:result})})
    .catch((err)=>{res.send({message:'server err'})})

})

app.get('/get-user/:uId',(req,res)=>{
    const _userId = req.params.uId;
    User.findOne({_id:_userId})
    .then((result)=>{
        res.send({message:'success',user:{email:result.email,
            mobile:result.mobile,
            username:result.username}})
    })
    .catch((err)=>{
        res.send({message:'saved error',
                error:err
        })
    })
})

app.post('/signup', async (req,res)=>{
    //getting data from frontend

    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const user = new User({username: username, password:password,email,mobile});

    await user.save()
     .then(()=>{
        res.send({message:"saved succesfully"});
     })
     .catch((err)=>{
        res.send({
            message:"server err",
            Error:err
        })
     })

})
//login api

app.post('/login',async (req,res)=>{
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    //isme hm find krenge
     await User.findOne({username:username})
    .then((result)=>{
        console.log("user data",result); // comsole pr 
        if(!result)
            {
                res.send({message:"user not found"}); //response sign vale handle api ke alert men print hoga
            }
            else{
                if(result.password !== password)
                    {
                        res.send({message:"Password not match"});
                    }
                    else{
                        //also retun a json web token
                        const token = jwt.sign({
                            data:result,    
                        },
                        'MYSECRETKEY',
                        {
                        expiresIn:'24h'
                        }
                     )
                     //token men response men userId ko bhi send kr diya hai 
                        res.send({message:"find succesfully",token:token,userId:result._id}); //message
                    }
            }
       
     })
     .catch((err)=>{
        res.send({
            message:"server err",
            Error:err
        })
     })
})



//for print something on browser
app.listen(process.env.PORT,()=>{
    console.log(`Example app listening on port ${process.env.PORT}`)
})




