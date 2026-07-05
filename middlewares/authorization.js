const express=require("express");
const teamModel=require("../models/teamModel");
const projectModel=require("../models/dashboard");

function restrictTo(...validPositions){
    return async function (req,res,next){
        try{
            let position="Member";
            const projectId=req.params.projectId;
            const project=await projectModel.findById(req.params.projectId).select("owner").populate("owner","fullName");
            console.log(project.owner._id.toString());
            console.log(req.user.id);
            if(req.user.id===project.owner._id.toString()){
                console.log("yha per");
                req.position="Owner";
                next();
                return;
            }
            console.log("nhi yha per");
            const projectTeamCollection=await teamModel.findOne({
                projectId:projectId,
                member:req.user.id
            })
            if(projectTeamCollection.position==="Admin"){
                console.log("hello");
                position="Admin";
            }
            console.log(position,validPositions);
            if(!validPositions.includes(position)){
                console.log("hello bro");
                return res.json({msg:"not authorized for that action"});
            }
            req.position="Admin";
            next(); 
        }catch(err){
            console.log("Error:",err);
            return res.json({msg:"something went wrong"});
        }
    } 
}
module.exports=restrictTo;