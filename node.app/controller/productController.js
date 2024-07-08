const Products = require("../model/Products");


module.exports.search = async (req,res)=>{

    
    
    const latitude = req.query.loc.split(',')[0];//split krne se ye array ho jayega jiska 0 index hm le lenge then
    const longitude = req.query.loc.split(',')[1];//then yaha se hm longitude nikal lenge 

    //is query ke basis pr hm result ko find out krenge
    let search = req.query.search;
    //find the data from mongodb is prakar hm mongodb se data ko find krenge
    Products.find({
        $or:[
           { productName:{$regex:search} },
           { productDesc:{$regex:search} },
           { category:{$regex:search} },
           { price:{$regex:search} },
        ],
        //hmara second criteria jo hoga vo location vala hoga
        // pLoc:{//hm near vale bhi return krke denge
        //     $near:{
        //         $geometry: {
        //             type:"Point",
        //             coordinates:[parseFloat(latitude),parseFloat(longitude)]
        //         }
        //     },
        //     $maxDistance :500 * 1000,
        // }
    })
    .then((result)=>{
        //console.log("user data ->",result)
        res.send({message:'data fetch succesfully',products:result})})
    .catch((err)=>{res.send({message:'server err'})})

}

module.exports.addProduct = async(req,res)=>{
    //for check what i get from body
   
    
    //fetching the data 
    const plat = req.body.plat;
    const plong = req.body.plong;
    const {productName,productDesc,price,category} = req.body;
    const productImage = req.files.productImage[0].path;  //yaha hm product ki image nikal rahe hai jo ki product ki form men hai
    const productImage2 = req.files.productImage2[0].path;
    const addedBy = req.body.userId;

    //entry in database key value same to ek hee bar likh sakte hai

    const products = new Products ({
        productName,productDesc,
        price,category,productImage,
        productImage2,addedBy,
       pLoc:{type:'Point', coordinates:[plat,plong]}
});

    await products.save()
    .then(()=>{res.send({message : 'saved success'})})
    .catch((err)=>{res.send({message: 'server err'})})
}

module.exports.getProduct = async(req,res)=>{

    const catName = req.query.catName;

    //console.log("category--->",catName);

    let _f = {}
    if(catName)
        {
            _f={category:catName}
        }

        await Products.find(_f)
    .then((result)=>{
               
        res.send({message:'data fetch succesfully',products:result})})
    .catch((err)=>{res.send({message:'server err'},
        err
    )})

}

module.exports.getProductById = async(req,res)=>{
    //we can check the data using the console
   
    //ye id find out krenge jo ki product ki id hai
    //ek hee product hoga isliye findOne ka use krenge
    await Products.findOne({_id:req.params.productId})
    .then((result)=>{
       
        res.send({message:'data fetch succesfully',product:result})})
    .catch((err)=>{res.send({message:'server err'})})
}

module.exports.myProducts = async (req,res)=>{
    //liked products ko hm user ke andar se find krenge
    //console.log("liked products")
    const userId = req.body.userId;
    //user id added by ke equal hai vo vale product
    await Products.find({addedBy:userId})
    .then((result)=>{
   
    res.send({message:'data fetch succesfully',products:result})})
    .catch((err)=>{res.send({message:'server err',err})})
}


