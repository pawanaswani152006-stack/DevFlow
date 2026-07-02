const express=require("express");
const project=require("../models/dashboard.js");

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
        return res.json({
            success:true,
            msg:"Created",
            project:newProject
        });  
    }catch(err){
        console.log("Error:",err);
    }
}

async function getProjects(req,res){
    try{
        const projects=await project.find({owner:req.user.id});
        return res.json({arr:projects});
    }catch(err){
        return res.redirect("/?mode1=signIn.html");
    }
}

module.exports={
    createProj,
    getProjects
}