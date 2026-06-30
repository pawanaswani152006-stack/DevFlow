const jwt=require("jsonwebtoken");
const secretKey="$$p@w@n$$#";
let {isSuccess}=require("../controllers/authControl.js");

async function checkAuth(req,res,next){
    const token=req.cookies.Token;

    if(!token){
        return res.redirect("signIn.html");
    }

    try{
        const decoded=jwt.verify(token,secretKey);
        req.user=decoded;
        next();
    }catch(err){
        return res.redirectTo("signIn.html");
    }
}

module.exports=checkAuth;