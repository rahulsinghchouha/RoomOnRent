const User = require("../model/User");

exports.signUp = async(req,res)=>{
    try{
        //fetching the data
        const {userName,password} = req.body;

        //validation
        if(!userName || !pawword)
            {
                return res.status(403).send({
                success: false,
				message: "All Fields are required",
                })
            }  

        //create the object

        const user = new User({username:username,password:password});
        await user.save();




    }catch(err){
        
    }
}