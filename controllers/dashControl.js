const express=require("express");
const project=require("../models/dashboard.js");

async function createProj(req,res){
    try{
        const body=req.body;
        const {projectName , trackingMode , description}=body;
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
        }else if(!description){
            return res.json({description:"Please fill the desription"});
        }

        const newProject= await project.create({
            owner:req.user.id,
            projectName:projectName,
            description:description,
            trackingMode:trackingMode,
            deadline:deadline
        });
        return res.send(200).json({
            success:true,
            msg:"Created"
        });  
    }catch(err){
        console.log("Error:",err);
    }
    
}
module.exports=createProj;