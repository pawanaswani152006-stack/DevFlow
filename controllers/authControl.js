const express=require("express");
const newUser=require("../models/logIn.js");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const validator=require("validator");
const sessionModel=require("../models/refreshSession.js");
const {sendVarificationEmail,sendPassResetEmail}=require("../utils/sendMail.js");
const emailVarificationModel=require("../models/emailVarificationModel.js");
const resetPassModel=require("../models/resetPasswordModel.js");
const newUserVerificationModel=require("../models/newUserVerificationModel.js");

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
        await newUserVerificationModel.deleteOne({email:email});
        const user=await newUserVerificationModel.create({
            fullName:fullName,
            email:email,
            password:password,
            isVerified:false,
            expiresAt:new Date(Date.now()+(30*60*1000))
        });
        const rawToken=crypto.randomBytes(32).toString("hex");
        const hashedToken=crypto.createHash("sha256")
            .update(rawToken)
            .digest("hex");
        const varificationLink=`http://localhost:8000/verifyEmail?token=${encodeURIComponent(rawToken)}`;
        sendVarificationEmail(user.email,varificationLink);
        const entity=await emailVarificationModel.findOneAndUpdate({userId:user._id},{
            token:hashedToken,
            expiresAt:new Date(Date.now()+(15*60*1000)),
            resendAvailableAt:new Date(Date.now()+(60*1000))
        })
        if(!entity){
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
            if(user.isDeleted){
                return res.json({msg:"Invalid email or password"});
            }
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
        const user=await newUserVerificationModel.findByIdAndUpdate(emailVarificationEntity.userId,{
            isVarified:true
        });
        await emailVarificationModel.findByIdAndDelete(emailVarificationEntity._id);
        return res.json({msg:"done"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg3:"Something went wrong."});
    }
}

async function emailVarificationForResetPassword(req,res){
    try{
        const resetPassToken=req.query.passToken;
        if(!resetPassToken){
            return res.json({msg:"link expired"});
        }
        const hashedToken=crypto.createHash("sha256")
            .update(resetPassToken)
            .digest("hex");
        const resetPassEntity=await resetPassModel.findOne({token:hashedToken});
        if(!resetPassEntity){
            return res.json({msg:"link expired"});
        }
        if(resetPassEntity.isUsed){
            return res.json({msg:"link already used."});
        }
        await resetPassModel.findByIdAndUpdate(resetPassEntity._id,{
            isVerified:true,
            isUsed:true
        });
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
        const user=await newUserVerificationModel.findById(userId.userId).select("isVarified");
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
        const user=await newUserVerificationModel.findById(userId);
        const verifiedUser=await newUser.create({
            fullName:user.fullName,
            email:user.email,
            password:user.password,
            isVarified:user.isVarified
        });
        await newUserVerificationModel.findByIdAndDelete(user._id);
        const token=await jwt.sign({
            id:verifiedUser._id,
            email:verifiedUser.email
        },
        secretKey,
        {
            expiresIn:"1h"
        });
        const jti=crypto.randomUUID();
        const refreshToken=await jwt.sign({
            id:verifiedUser._id,
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
            userId:verifiedUser._id.toString(),
            jti:jti,
            expiresAt:new Date(Date.now()+(90*24*60*60*1000))
        });
        await emailVarificationModel.findOneAndDelete({userId:userId});
        res.clearCookie("verifyUserToken");
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function resendEmail(req,res){
    try{
        const userId=req.params.userId;
        const user=await newUserVerificationModel.findById(userId).select("email");
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
        const user=await newUserVerificationModel.findById(userId).select("email");
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
        const user=await newUserVerificationModel.findByIdAndUpdate(userId,{
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
        const hashedToken=crypto.createHash("sha256")
            .update(rawToken)
            .digest("hex");
        const varificationLink=`http://localhost:8000/verifyEmail?token=${encodeURIComponent(rawToken)}`;
        sendVarificationEmail(user.email,varificationLink);
        const emailVerificationEntity=await emailVarificationModel.findOneAndUpdate({userId:userId},{
            token:hashedToken,
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

async function passResendTime(req,res){
    try{
        const userId=req.params.userId;
        if(!userId){
            return res.json({msg:"userId must be given"});
        }
        const entity=await resetPassModel.findOne({userId:userId}).select("resendAvailableAt");
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
        const token=crypto.randomBytes(32).toString("hex");
        const hashedToken=crypto.createHash("sha256")
            .update(token)
            .digest("hex");
        const entity=await resetPassModel.findOneAndUpdate({userId:user._id},{
            token:hashedToken,
            expiresAt:new Date(Date.now()+(15*60*1000)),
            resendAvailableAt:new Date(Date.now()+(60*1000))
        })
        if(!entity){
            await resetPassModel.create({
                userId:user._id,
                token:token,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000))
            });
        }
        const varificationLink=`http://localhost:8000/verifyEmailForPass?passToken=${encodeURIComponent(token)}`;
        sendPassResetEmail(user.email,varificationLink);
        const resetPassToken=await jwt.sign({
            token:token
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("resetPassToken",resetPassToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        return res.json({msg:"success",id:user._id});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function checkForResetPass(req,res){
    try{
        const resetPassToken=req.cookies.resetPassToken;
        if(!resetPassToken){
            return res.json({msg:"link expired"});
        }
        const decodedToken=await jwt.verify(resetPassToken,secretKey);
        const hashedToken=crypto.createHash("sha256")
            .update(decodedToken.token)
            .digest("hex");
        const resetPassEntity=await resetPassModel.findOne({token:hashedToken});
        if(!resetPassEntity){
            return res.json({msg:"link expired"});
        }
        if(resetPassEntity.isVerified){
            await resetPassModel.findByIdAndDelete(resetPassEntity._id);
            res.clearCookie("resetPassToken")
            return res.json({msg:"success"});
        }
        return res.json({msg:"failed"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function cancelResetPassProcess(req,res){
    try{
        const resetPassToken=req.cookies.resetPassToken;
        if(resetPassToken){
            const decodedToken=await jwt.verify(resetPassToken,secretKey);
            const hashedToken=crypto.createHash("sha256")
                .update(decodedToken.token)
                .digest("hex");
            const resetPassEntity=await resetPassModel.findOne({token:hashedToken});
            if(resetPassEntity){
                await resetPassModel.findByIdAndDelete(resetPassEntity._id);
            }
            res.clearCookie("resetPassToken");
        }
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function setNewPassword(req,res){
    try{
        const body=req.body;
        if(!body || (!body.id || !body.confirmPass || !body.newPass) || (body.newPass.length<8) || (body.newPass!==body.confirmPass)){
            return res.json({msg:"there is some mistake in your provided data."});
        }
        const user=await newUser.findById(body.id).select("salt");
        if(!user){
            return res.json({msg:"account does not exist."});
        }
        const hashedPassword=crypto.createHmac("sha256",user.salt)
            .update(body.newPass)
            .digest("hex");
        await newUser.findByIdAndUpdate(body.id,{
            password:hashedPassword
        });
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function resendResetPassLink(req,res){
    try{
        const userId=req.params.userId;
        const user=await newUser.findById(userId).select("email");
        const resetPassEntity=await resetPassModel.findOne({userId:userId}).select("resendAvailableAt");
        if(resetPassEntity){
            const currTime=new Date();
            const allowedTime=resetPassEntity.resendAvailableAt.getTime();
            if(currTime<allowedTime){
                return res.json({msg:"please wait for time."});
            }
        }
        const resendToken=crypto.randomBytes(32).toString("hex");
        if(resetPassEntity){
            const hashedToken=crypto.createHash("sha256")
                .update(resendToken)
                .digest("hex");
            await resetPassModel.findByIdAndUpdate(resetPassEntity._id,{
                token:hashedToken,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000))
            });
        }else{
            await resetPassModel.create({
                userId:userId,
                token:resendToken,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000))
            });
        }
        const resetPassToken=await jwt.sign({
            token:resendToken
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("resetPassToken",resetPassToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        const varificationLink=`http://localhost:8000/verifyEmailForPass?passToken=${encodeURIComponent(resendToken)}`;
        sendPassResetEmail(user.email,varificationLink);
        return res.json({msg:"success"});
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
    emailVarificationForResetPassword,
    checkForResetPass,
    cancelResetPassProcess,
    setNewPassword,
    resendResetPassLink,
    passResendTime,
    isSuccess
};