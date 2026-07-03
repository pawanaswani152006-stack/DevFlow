const jwt=require("jsonwebtoken");
const secretKey="$$p@w@n$$#";
const newUser=require("../models/logIn.js");

async function checkAuth(req,res,next){
    const token=req.cookies.Token;

    if(!token){
        return res.redirect("/");
    }

    try{
        const decoded=jwt.verify(token,secretKey);
        const user=await newUser.findById(decoded.id);
        if(!user){
            return res.redirect("/");
        }
        req.user=decoded;
        next();
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
}

module.exports=checkAuth;