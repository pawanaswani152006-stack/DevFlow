const jwt=require("jsonwebtoken");
const secretKey=process.env.secretKey;
const newUser=require("../models/logIn.js");
const crypto=require("crypto");
const sessionModel=require("../models/refreshSession.js");

async function checkAuth(req,res,next){
    try{
        const token=req.cookies.Token;
        const refreshToken=req.cookies.refreshToken;

        if(!token){
            if(!refreshToken){
                return res.redirect("/");
            }
            const refreshTokenVarify=await jwt.verify(refreshToken,secretKey);
            const existingUser=await newUser.findById(refreshTokenVarify.id);
            if(!existingUser){
                return res.redirect("/");
            }
            const jti=refreshTokenVarify.jti;
            const newToken=await jwt.sign({
                id:existingUser._id,
                email:existingUser.email
            },
            secretKey,
            {
                expiresIn:"1h"
            });
            const newJti=crypto.randomUUID();
            const newRefreshToken=await jwt.sign({
                id:existingUser._id,
                jti:newJti
            },
            secretKey,
            {
                expiresIn:"90d"
            });

            await sessionModel.updateOne(
                {
                    userId:refreshTokenVarify.id,
                    jti:jti
                },
                {
                    $set:{
                        jti:newJti,
                        expiresAt:new Date(Date.now()+(90*24*60*60*1000))
                    }
                }
            )
            res.clearCookie("refreshToken",{
                httpOnly:true
            });
            res.cookie("Token",newToken,{
                httpOnly:true,
                maxAge:60 * 60 * 1000
            });
            res.cookie("refreshToken",newRefreshToken,{
                httpOnly:true,
                maxAge:(90*24*60*60*1000)
            });
            req.user=refreshTokenVarify;
            return next();
        }

        const decoded=await jwt.verify(token,secretKey);
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