const express=require("express");
const teamModel=require("../models/teamModel");
const projectModel=require("../models/dashboard");

function restrictTo(...validPositions){
    return async function (req,res,next){
        try{
            let position="Member";
            const projectId=req.params.projectId;
            const project=await projectModel.findById(req.params.projectId).select("owner").populate("owner","fullName");
            if(req.user.id===project.owner._id.toString()){
                position="Owner";
            }else{
                const projectTeamCollection=await teamModel.findOne({
                    projectId:projectId,
                    member:req.user.id
                })
                if(projectTeamCollection.position==="Admin"){
                    position="Admin";
                }
            }
            if(!validPositions.includes(position)){
                return res.json({msg:"not authorized for that action"});
            }
            req.position=position;
            next(); 
        }catch(err){
            console.log("Error:",err);
            return res.json({msg:"something went wrong"});
        }
    } 
}
module.exports=restrictTo;