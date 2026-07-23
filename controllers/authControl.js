const express=require("express");
const newUser=require("../models/logIn.js");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const validator=require("validator");
const sessionModel=require("../models/refreshSession.js");
const sendVarificationEmail=require("../utils/sendMail.js");
const emailVarificationModel=require("../models/emailVarificationModel.js");
const resetPassModel=require("../models/resetPasswordModel.js");

const secretKey=process.env.secretKey;
let isSuccess=false;

async function createUser(req,res){
    try{
        const body=req.body;
        const {fullName,email,password,reEnteredPassword}=body;
        const existingUser=await newUser.findOne({email});
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
            });
        }
        if(existingUser){
            return res.status(409).json({alreadyMsg:"email alrealdy exist!"});
        }
        if(password.length<8){
            return res.status(400).json({passMsg:"password should be 8 characters long."});
        }
        if(password!==reEnteredPassword){
            return res.status(400).json({reMsg:"Re-entered password is different."});
        }
        const user=await newUser.create({
            fullName:fullName,
            email:email,
            password:password
        });
        const rawToken=crypto.randomBytes(32).toString("hex");
        const varificationLink=`http://localhost:8000/verifyEmail?token=${encodeURIComponent(rawToken)}`;
        sendVarificationEmail(user.email,varificationLink);
        await emailVarificationModel.create({
            userId:user._id,
            token:rawToken,
            expiresAt:new Date(Date.now()+(15*60*1000)),
            resendAvailableAt:new Date(Date.now()+(60*1000))
        });
        const verifyUserToken=await jwt.sign({
            userId:user._id
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("verifyUserToken",verifyUserToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        return res.json({
            isSuccess:true,
            msg:"success"
        });
    }catch(err){
        console.log("Error:",err);
        return res.status(500).json({msg:"Something went wrong."});
    }
};
async function varifyUser(req,res){
    try{
        let body=req.body;
        let {email,password}=body;
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
        });
        }
        let user=await newUser.findOne({email});
        if(!user){
            return res.json({msg1:"Invalid email or password!"});
        }
        let salt=user.salt;
        const hashedPassword=await crypto.createHmac("sha256",salt)
                .update(password)
                .digest("hex");
        if(hashedPassword===user.password){
            if(!user.isVarified){
                return res.json({msg:"Verify your email first."});
            }
            const token=await jwt.sign({
                id:user._id,
                email:user.email
            },secretKey,{expiresIn:"1h"});
            const jti=crypto.randomUUID();
            const refreshToken=await jwt.sign({
                id:user._id,
                jti:jti
            },
            secretKey,
            {
                expiresIn:"90d"
            })
            res.cookie("Token",token,{
                httpOnly:true,
                maxAge:60 * 60 * 1000
            });
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                maxAge:(90*24*60*60*1000)
            });
            await sessionModel.create({
                userId:user._id.toString(),
                jti:jti,
                expiresAt:new Date(Date.now()+(90*24*60*60*1000))
            });
            return res.json({
                isSuccess:true,
                msg:"success",
                redirectTo:"/dashboard"
            });
        }else{
            return res.json({msg2:"Invalid email or password!"});
        }
    }catch(error){
        return res.json({msg3:"Something went wrong."});
    }
};

async function emailVarification(req,res){
    try{
        const emailVarificationToken=req.query.token;
        const hashedToken=crypto.createHash("sha256")
            .update(emailVarificationToken)
            .digest("hex");
        const emailVarificationEntity=await emailVarificationModel.findOne({token:hashedToken});
        if(!emailVarificationEntity){
            return res.json({msg:"link expired"});
        }
        const user=await newUser.findByIdAndUpdate(emailVarificationEntity.userId,{
            isVarified:true
        });
        await emailVarificationModel.findByIdAndDelete(emailVarificationEntity._id);
        return res.json({msg:"done"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg3:"Something went wrong."});
    }
}

async function getUser(req,res){
    try{
        const verifyUserToken=req.cookies.verifyUserToken;
        if(!verifyUserToken){
            return res.json({expire:true});
        }
        const userId=await jwt.verify(verifyUserToken,secretKey);
        const user=await newUser.findById(userId.userId).select("isVarified");
        if(!user){
            return res.json({msg:"user can't be find."});
        }
        return res.json({isVarified:user,userId:userId.userId});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg3:"Something went wrong."});
    }
}

async function goDashboard(req,res){
    try{
        const userId=req.params.userId;
        const user=await newUser.findById(userId);
        const token=await jwt.sign({
            id:user._id,
            email:user.email
        },
        secretKey,
        {
            expiresIn:"1h"
        });
        const jti=crypto.randomUUID();
        const refreshToken=await jwt.sign({
            id:user._id,
            jti:jti
        },
        secretKey,
        {
            expiresIn:"90d"
        })
        res.cookie("Token",token,{
            httpOnly:true,
            maxAge:60 * 60 * 1000
        });
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:(90*24*60*60*1000)
        });
        await sessionModel.create({
            userId:user._id.toString(),
            jti:jti,
            expiresAt:new Date(Date.now()+(90*24*60*60*1000))
        });
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function resendEmail(req,res){
    try{
        const userId=req.params.userId;
        const user=await newUser.findById(userId).select("email");
        if(!user){
            return res.json({msg:"user can't be find."});
        }
        const entity=await emailVarificationModel.findOne({userId:userId}).select("resendAvailableAt");
        if(entity){
            const currentTime=Date.now();
            const allowedTime=entity.resendAvailableAt.getTime();
            if(currentTime<allowedTime){
                return res.json({msg:"link can't be resend before time."});
            }
        }
        const rawToken=crypto.randomBytes(32).toString("hex");
        const hashed=crypto.createHash("sha256")
                .update(rawToken)
                .digest("hex");
        const varificationLink=`http://localhost:8000/verifyEmail?token=${encodeURIComponent(rawToken)}`;
        sendVarificationEmail(user.email,varificationLink);
        const emailVerificationEntity=await emailVarificationModel.findOneAndUpdate({userId:userId},{
            token:hashed,
            expiresAt:new Date(Date.now()+(15*60*1000)),
            resendAvailableAt:new Date(Date.now()+(60*1000))
        })
        if(!emailVerificationEntity){
            await emailVarificationModel.create({
                userId:user._id,
                token:rawToken,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000))
            });
        }
        const verifyUserToken=await jwt.sign({
            userId:user._id
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("verifyUserToken",verifyUserToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function getEmail(req,res){
    try{
        const userId=req.params.userId;
        const user=await newUser.findById(userId).select("email");
        return res.json({msg:"success",email:user.email});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function changeEmail(req,res){
    try{
        const userId=req.params.userId;
        const body=req.body;
        if(!body.email){
            return res.json({msg:"email must be provide."})
        }
        if(!validator.isEmail(body.email)){
            return res.json({msg:"email should be valid."});
        }
        const existingUser=await newUser.findOne({email:body.email});
        if(existingUser){
            return res.json({msg:"account already exist."});
        }
        const user=await newUser.findByIdAndUpdate(userId,{
            email:body.email
        },{
            new:true
        });
        if(!user){
            return res.json({msg:"user can't be find."});
        }
        const entity=await emailVarificationModel.findOne({userId:userId}).select("resendAvailableAt");
        if(entity){
            const currentTime=Date.now();
            const allowedTime=entity.resendAvailableAt.getTime();
            if(currentTime<allowedTime){
                return res.json({msg:"link can't be resend before time."});
            }
        }
        const rawToken=crypto.randomBytes(32).toString("hex");
        const varificationLink=`http://localhost:8000/verifyEmail?token=${encodeURIComponent(rawToken)}`;
        sendVarificationEmail(user.email,varificationLink);
        const emailVerificationEntity=await emailVarificationModel.findOneAndUpdate({userId:userId},{
            token:rawToken,
            expiresAt:new Date(Date.now()+(15*60*1000)),
            resendAvailableAt:new Date(Date.now()+(60*1000))
        })
        if(!emailVerificationEntity){
            await emailVarificationModel.create({
                userId:user._id,
                token:rawToken,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000))
            });
        }
        const verifyUserToken=await jwt.sign({
            userId:user._id
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("verifyUserToken",verifyUserToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function resendTime(req,res){
    try{
        const userId=req.params.userId;
        if(!userId){
            return res.json({msg:"userId must be given"});
        }
        const entity=await emailVarificationModel.findOne({userId:userId}).select("resendAvailableAt");
        if(!entity){
            return res.json({msg:"not exist."});
        }
        const currentTime=Date.now();
        const allowedTime=entity.resendAvailableAt.getTime();
        if(currentTime<allowedTime){
            const remainingSeconds=Math.ceil((allowedTime-currentTime)/1000);
            return res.json({remainingSeconds:remainingSeconds,msg:"success"});
        }
        return res.json({msg:"timeout"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function sendLink(req,res){
    try{
        const body=req.body;
        if(!body.email){
            return res.json({msg:"email must be provided."});
        }
        const user=await newUser.findOne({email:body.email});
        if(!user){
            return res.json({msg:"email doesn't exist."});
        }
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

module.exports={
    createUser,
    varifyUser,
    emailVarification,
    getUser,
    goDashboard,
    resendEmail,
    getEmail,
    changeEmail,
    resendTime,
    sendLink,
    isSuccess
};