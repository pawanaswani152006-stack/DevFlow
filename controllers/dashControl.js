const express=require("express");
const project=require("../models/dashboard.js");
const teamModel=require("../models/teamModel.js");
const newUser=require("../models/logIn.js");
const crypto=require("crypto");
const newEmailVarificationModel=require("../models/newEmailVerificationModel.js");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const {sendVarificationEmail}=require("../utils/sendMail.js");
const sessionModel = require("../models/refreshSession.js");
const activityModel=require("../models/acitivityModel.js");
const chatModel=require("../models/chatModel.js");
const pdfModel=require("../models/pdfModel.js");
const personalNoteModel=require("../models/personalNoteModel.js");
const taskModel=require("../models/taskModel.js");
const cloudinary = require("../config/cloudinary");

const secretKey=process.env.secretKey;

async function createProj(req,res){
    try{
        const body=req.body;
        const {projectName,textArea}=body;
        const deadline=new Date(body.deadline);
        const today=new Date();
        today.setHours(0,0,0,0);
        deadline.setHours(0,0,0,0);
        if(!projectName){
            return res.json({name:"Project name can't be empty."});
        }else if(!deadline){
            return res.json({deadline:"Deadline should not be empty."});
        }else if(deadline<today){
            return res.json({deadline:"Date should be correct."});
        }else if(!textArea){
            return res.json({textArea:"Please fill the desription"});
        }

        const newProject= await project.create({
            owner:req.user.id,
            projectName:projectName,
            description:textArea,
            deadline:deadline
        });
        const projectCard=await project.findById(newProject._id).populate("owner","fullName");
        return res.json({
            success:true,
            msg:"Created",
            project:projectCard
        });  
    }catch(err){
        console.log("Error:",err);
    }
}

async function getProjects(req,res){
    try{
        const projects=await project.find({owner:req.user.id}).populate("owner","fullName");
        const sharedProjects=await teamModel.find({memberEmail:req.user.email}).select("projectId");
        for(const item of sharedProjects){
            const share=await project.findById(item.projectId).populate("owner","fullName");
            if(share) projects.push(share);
        }
        const dashboardOwner=await newUser.findById(req.user.id).select("fullName");
        return res.json({arr:projects,dashboardOwner:dashboardOwner});
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
}

async function getProfile(req,res){
    try{
        const user=await newUser.findById(req.user.id).select("fullName email createdAt");
        return res.json({msg:"success",user:user});
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
}

async function editName(req,res){
    try{
        if(!req.body.newName){
            return res.json({msg:"userName can't be empty."});
        }
        const user=await newUser.findByIdAndUpdate(req.user.id,{
            fullName:req.body.newName
        },{
            new:true
        });
        if(!user){
            return res.json({msg:"user can't be find"});
        }
        return res.json({msg:"success",fullName:user.fullName});
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
}

async function setNewPass(req,res){
    try{
        const body=req.body;
        if(!body || (!body.confirmPass || !body.newPass) || (body.newPass.length<8) || (body.newPass!==body.confirmPass)){
            return res.json({msg:"there is some mistake in your provided data."});
        }
        const user=await newUser.findById(req.user.id).select("salt");
        if(!user){
            return res.json({msg:"account does not exist."});
        }
        const hashedPassword=crypto.createHmac("sha256",user.salt)
            .update(body.newPass)
            .digest("hex");
        await newUser.findByIdAndUpdate(req.user.id,{
            password:hashedPassword
        });
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function sendNewEmailChangeLink(req,res){
    try{
        console.log("hello");
        const body=req.body;
        if(!body.newEmail){
            return res.json({msg:"email is required."});
        }
        if(!validator.isEmail(body.newEmail)){
            return res.json({msg:"Enter a valid email"});
        }
        console.log("yha per");
        const user=await newUser.findOne({email:body.newEmail});
        if(user){
            return res.json({msg:"account already exist"});
        }
        console.log("hello bro");
        const token=crypto.randomBytes(32).toString("hex");
        const hashedToken=crypto.createHash("sha256")
            .update(token)
            .digest("hex");
        const entity=await newEmailVarificationModel.findOneAndUpdate({userId:req.user.id},{
            token:hashedToken,
            expiresAt:new Date(Date.now()+(15*60*1000)),
            resendAvailableAt:new Date(Date.now()+(60*1000)),
            isClick:false,
            newEmail:body.newEmail
        });
        if(!entity){
            await newEmailVarificationModel.create({
                userId:req.user.id,
                token:token,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000)),
                newEmail:body.newEmail
            });
        }
        const newEmailSetToken=await jwt.sign({
            token:token
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("newEmailSetToken",newEmailSetToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        const varificationLink=`http://localhost:8000/dashboard/projects/verifyEmail?token=${encodeURIComponent(token)}`;
        sendVarificationEmail(body.newEmail,varificationLink);
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function resendSetNewEmailLink(req,res){
    try{
        const body=req.body;
        if(!body.newEmail){
            return res.json({msg:"email is required."});
        }
        if(!validator.isEmail(body.newEmail)){
            return res.json({msg:"Enter a valid email"});
        }
        const existingToken=req.cookies.newEmailSetToken;
        const token=crypto.randomBytes(32).toString("hex");
        const hashedToken=crypto.createHash("sha256")
            .update(token)
            .digest("hex");
        let entity=null;
        if(existingToken){
            const decodedToken=await jwt.verify(existingToken,secretKey);
            const existingHashedToken=crypto.createHash("sha256")
                .update(decodedToken.token)
                .digest("hex");
            entity=await newEmailVarificationModel.findOne({token:existingHashedToken}).select("resendAvailableAt");
            if(entity){
                const presentTime=new Date();
                const allowedTime=entity.resendAvailableAt.getTime();
                if(presentTime<allowedTime){
                    return res.json({msg:"It is waiting time for resend"});
                }
                await newEmailVarificationModel.findByIdAndUpdate(entity._id,{
                    token:hashedToken,
                    expiresAt:new Date(Date.now()+(15*60*1000)),
                    resendAvailableAt:new Date(Date.now()+(60*1000))
                });
            }
        }else{
            await newEmailVarificationModel.findOneAndDelete({userId:req.user.id});
        }
        if(entity===null || entity===undefined){
            await newEmailVarificationModel.create({
                userId:req.user.id,
                token:token,
                expiresAt:new Date(Date.now()+(15*60*1000)),
                resendAvailableAt:new Date(Date.now()+(60*1000)),
                newEmail:body.newEmail
            });
        }
        const newEmailSetToken=await jwt.sign({
            token:token
        },
        secretKey,
        {
            expiresIn:"15m"
        });
        res.cookie("newEmailSetToken",newEmailSetToken,{
            httpOnly:true,
            maxAge:(15 * 60 * 1000)
        });
        const varificationLink=`http://localhost:8000/dashboard/projects/verifyEmail?token=${encodeURIComponent(token)}`;
        sendVarificationEmail(body.newEmail,varificationLink);
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function verifyEmail(req,res){
    try{
        const token=req.query.token;
        if(!token){
            return res.json({msg:"Token must be given."});
        }
        const hashedToken=crypto.createHash("sha256")
            .update(token)
            .digest("hex");
        const entity=await newEmailVarificationModel.findOneAndUpdate({token:hashedToken},{
            isClick:true
        });
        if(!entity){
            return res.json({msg:"link expired"});
        }
        return res.json({msg:"done"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function checkForNewEmailVerification(req,res){
    try{
        const token=req.cookies.newEmailSetToken;
        if(!token){
            return res.json({msg:"link expired"});
        }
        const decodedToken=await jwt.verify(token,secretKey);
        const hashedToken=crypto.createHash("sha256")
            .update(decodedToken.token)
            .digest("hex");
        const entity=await newEmailVarificationModel.findOne({token:hashedToken});
        if(!entity){
            return res.json({msg:"link expired"});
        }
        if(!entity.isClick){
            return res.json({msg:"failed"});
        }
        const user=await newUser.findByIdAndUpdate(entity.userId,{
            email:entity.newEmail
        },{
            new:true
        });
        await newEmailVarificationModel.findByIdAndDelete(entity._id);
        res.clearCookie("newEmailSetToken");
        if(!user){
            return res.json({msg:"user is not found."});
        }
        return res.json({msg:"success",email:user.email});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function cancelNewEmailSetProcess(req,res){
    try{
        const token=req.cookies.newEmailSetToken;
        if(!token){
            await newEmailVarificationModel.findOneAndDelete({userId:req.user.id});
            return res.json({msg:"success"});
        }
        const decodedToken=await jwt.verify(token,secretKey);
        const hashedToken=crypto.createHash("sha256")
            .update(decodedToken.token)
            .digest("hex");
        const entity=await newEmailVarificationModel.findOne({token:hashedToken});
        if(!entity){
            res.clearCookie("newEmailSetToken")
            return res.json({msg:"success"});
        }
        await newEmailVarificationModel.findByIdAndDelete(entity._id);
        res.clearCookie("newEmailSetToken");
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function resendAvailableTime(req,res){
    try{
        const token=req.cookies.newEmailSetToken;
        if(!token){
            return res.json({msg:"not available"});
        }
        const decodedToken=await jwt.verify(token,secretKey);
        const hashedToken=crypto.createHash("sha256")
            .update(decodedToken.token)
            .digest("hex");
        const entity=await newEmailVarificationModel.findOne({token:hashedToken});
        if(!entity){
            return res.json({msg:"not available"});
        }
        const presentTime=new Date();
        const allowedTime=entity.resendAvailableAt.getTime();
        if(presentTime<allowedTime){
            const remainingSeconds=Math.ceil((allowedTime-presentTime)/1000);
            return res.json({msg:"success",remainingSeconds:remainingSeconds});
        }
        return res.json({msg:"timeout"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function logOut(req,res){
    try{
        const userId=req.user.id;
        const refreshToken=req.cookies.refreshToken;
        const decodedToken=await jwt.verify(refreshToken,secretKey);
        const jti=decodedToken.jti;
        await sessionModel.findOneAndDelete({jti:jti});
        res.clearCookie("Token");
        res.clearCookie("refreshToken");
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function getProjectInfo(req,res){
    try{
        const projectId=req.params.projectId;
        const existingProject=await project.findById(projectId).populate("owner","fullName");
        if(!project){
            return req.json({msg:"project is not found."});
        }
        let position;
        if(req.user.id===existingProject.owner._id.toString()){
            position="Owner"
        }else{
            const userPosition=await teamModel.findOne({member:req.user.id}).select("position");
            position=userPosition.position;
        }
        return res.json({msg:"success",project:existingProject,position:position});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

async function deleteAccount(req,res){
    try{
        const userId=req.user.id;
        const ownedProject=await project.find({owner:userId}).select("_id");
        const projectIds=ownedProject.map(p=>p._id);
        if(projectIds.length!==0){
            const pdfs=await pdfModel.find({projectId:{$in:projectIds}}).select("storageId");
            if(pdfs.length!==0){
                await Promise.all(
                    pdfs.map(pdf=>
                        cloudinary.uploader.destroy(pdf.storageId,{
                            resource_type:"image"
                        })
                    )
                );
            }
            await Promise.all([
                teamModel.deleteMany({projectId:{$in:projectIds}}),
                taskModel.deleteMany({projectId:{$in:projectIds}}),
                activityModel.deleteMany({projectId:{$in:projectIds}}),
                personalNoteModel.deleteMany({projectId:{$in:projectIds}}),
                pdfModel.deleteMany({projectId:{$in:projectIds}}),
                chatModel.deleteMany({projectId:{$in:projectIds}}),
                project.deleteMany({_id:{$in:projectIds}})
            ]);
        }
        const teamProjects=await teamModel.find({member:userId}).select("projectId");
        const teamProjectIds=teamProjects.map(p=>p.projectId);
        if(teamProjectIds.length!==0){
            const teamPdfs=await pdfModel.find({projectId:{$in:teamProjectIds},scope:"personal",sender:userId}).select("storageId");
            if(teamPdfs.length!==0){
                await Promise.all(
                    teamPdfs.map(pdf=>
                        cloudinary.uploader.destroy(pdf.storageId,{
                            resource_type:"image"
                        })
                    )
                );
            }
            await Promise.all([
                teamModel.deleteOne({projectId:{$in:teamProjectIds},member:userId}),
                personalNoteModel.deleteMany({projectId:{$in:teamProjectIds},userId:userId}),
                pdfModel.deleteMany({projectId:{$in:teamProjectIds},scope:"personal",sender:userId}),
                chatModel.deleteMany({projectId:{$in:teamProjectIds},sender:userId,chatType:"dm"}),
                chatModel.deleteMany({projectId:{$in:teamProjectIds},receiver:userId,chatType:"dm"}),
            ]);
        }
        const refreshToken=req.cookies.refreshToken;
        const decodedToken=await jwt.verify(refreshToken,secretKey);
        const jti=decodedToken.jti;
        await sessionModel.findOneAndDelete({jti:jti});
        res.clearCookie("Token");
        res.clearCookie("refreshToken");
        await newUser.findByIdAndUpdate(userId,{
            fullName:"Former User",
            email:`dev@-${userId}-flow.com`,
            isDeleted:true,
            isVarified:false
        });
        return res.json({msg:"success"});
    }catch(error){
        console.log("Error:",error);
        return res.json({msg:"Something went wrong."});
    }
}

module.exports={
    createProj,
    getProjects,
    getProfile,
    editName,
    setNewPass,
    sendNewEmailChangeLink,
    verifyEmail,
    checkForNewEmailVerification,
    cancelNewEmailSetProcess,
    resendSetNewEmailLink,
    resendAvailableTime,
    logOut,
    getProjectInfo,
    deleteAccount
}