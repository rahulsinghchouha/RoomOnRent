const User = require("../model/User")
const jwt = require('jsonwebtoken');

module.exports.likeProducts = async(req,res)=>{
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

}
module.exports.dislikeProducts = async(req,res)=>{
    let productId = req.body.productId;
    let userId = req.body.userId;
    //console.log(req.body);
    

    //ab hme user vale model ko update krna hai liked array ko jese hm sql men where ka use 
    // vese hee yaha bhi use krenge id user id ke equal honi chahiye
    //yaha pr hmara like name ka array hai to usme data add krne ke liye hm $ addToSet ka use krenge
    //likedProduct is schema name and productId we getch from body
    await User.updateOne(
                    {_id:userId},
                    {
                        $pull :{likedProducts:productId}
                    }
                    )
        .then(()=>{
            res.send({message:"dis like success"})
        })
        .catch((err)=>{
            res.send({message:"like server err"})
        })

}

module.exports.signUp = async (req,res)=>{
    //getting data from frontend

   
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

}

module.exports.login = async (req,res)=>{
   
    const username = req.body.username;
    const password = req.body.password;

    //isme hm find krenge
     await User.findOne({username:username})
    .then((result)=>{
         // comsole pr 
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
                        res.send({message:"find succesfully",token:token,userId:result._id,username : result.username}); //message
                    }
            }
       
     })
     .catch((err)=>{
        res.send({
            message:"server err",
            Error:err
        })
     })
}

module.exports.myProfileById = async(req,res)=>{
   
    const uid = req.params.userId;

    User.findOne({_id:uid})
    .then((result)=>{
        res.send({
            message:" data fetched succesfully ",
            user:{
                email:result.email,
                mobile:result.mobile,
                username:result.username
            }
        })
    })
    .catch((err)=>{  
        res.send({
            message:"server err",
            error:err
        })
    })
}

module.exports.getUserById = async(req,res)=>{
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
}
module.exports.likedProducts = async (req,res)=>{
    //liked products ko hm user ke andar se find krenge
    

    await User.findOne({_id:req.body.userId}).populate('likedProducts')
    .then((result)=>{
   
    res.send({message:'data fetch succesfully',products:result.likedProducts})})
    .catch((err)=>{res.send({message:'server err'})})

}

