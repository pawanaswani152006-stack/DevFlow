const express=require("express");
const project=require("../models/dashboard.js");
const teamModel=require("../models/teamModel.js");
const newUser=require("../models/logIn.js");

async function createProj(req,res){
    try{
        const body=req.body;
        const {projectName , trackingMode , textArea}=body;
        const deadline=new Date(body.deadline);
        const today=new Date();
        if(!projectName){
            return res.json({name:"Project name can't be empty."});
        }else if(!deadline){
            return res.json({deadline:"Deadline should not be empty."});
        }else if(deadline<today){
            return res.json({deadline:"Date should be correct."});
        }else if(!trackingMode){
            return res.json({trackingMode:"Choose atleast one option."});
        }else if(!textArea){
            return res.json({textArea:"Please fill the desription"});
        }

        const newProject= await project.create({
            owner:req.user.id,
            projectName:projectName,
            description:textArea,
            trackingMode:trackingMode,
            deadline:deadline,
            status:"Active"
        });
        const ownerName=await newUser.findById(req.user.id).select("fullName");
        return res.json({
            success:true,
            msg:"Created",
            project:newProject,
            ownerName:ownerName.fullName
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
module.exports={
    createProj,
    getProjects
}