const jwt=require("jsonwebtoken");
const secretKey="$$p@w@n$$#";
let {isSuccess}=require("../controllers/authControl.js");
const newUser=require("../models/logIn.js");

async function checkAuth(req,res,next){
    const token=req.cookies.Token;

    if(!token){
        return res.redirect("signIn.html");
    }

    try{
        const decoded=jwt.verify(token,secretKey);
        const user=await newUser.findById(decoded.id);
        if(!user){
            return res.redirect("signIn.html");
        }
        req.user=decoded;
        next();
    }catch(err){
        return res.redirectTo("signIn.html");
    }
}

module.exports=checkAuth;