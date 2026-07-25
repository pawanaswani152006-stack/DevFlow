const express=require("express");
const project=require("../models/dashboard.js");
const teamModel=require("../models/teamModel.js");
const newUser=require("../models/logIn.js");
const crypto=require("crypto");

async function createProj(req,res){
    try{
        const body=req.body;
        const {projectName,textArea}=body;
        const deadline=new Date(body.deadline);
        const today=new Date();
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
        const user=await newUser.findById(req.user.id).select("fullName email");
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

module.exports={
    createProj,
    getProjects,
    getProfile,
    editName,
    setNewPass
}