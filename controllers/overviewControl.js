const express=require("express");
const newUser=require("../models/logIn.js");
const projectModel=require("../models/dashboard.js");
const taskModel=require("../models/taskModel.js");
const teamModel=require("../models/teamModel.js");
const activity=require("../models/acitivityModel.js");

async function getOverviewInfo(req,res){
    try{
        const projectId=req.params.projectId;
        const project=await projectModel.findById(projectId).populate("owner","fullName");
        if(!project){
            return res.json({msg:"project does not exist."});
        }
        const completedTaskLength=await taskModel.countDocuments({
            projectId:projectId,
            status:"Completed"
        });
        const totalTasks=await taskModel.countDocuments({
            projectId:projectId
        });
        let progress="0%";
        if(totalTasks!==0){
            progress=`${Math.round((completedTaskLength/totalTasks)*100)}%`;
        }
        const myTaskLength=await taskModel.countDocuments({
            assignedTo:req.user.id
        });
        const totalTeamMembers=await teamModel.countDocuments({
            projectId:projectId
        })
        const recentTasks=await taskModel.find({
            projectId:projectId
        })
        .populate("assignedTo","fullName")
        .select("task assignedTo")
        .sort({createdAt:-1})
        .limit(5);
        const recentActivity=await activity.find({
            projectId:projectId
        })
        .select("message")
        .sort({createdAt:-1})
        .limit(5);
        const teamMembers=await teamModel.find({projectId:projectId}).populate("member","fullName").select("member spaciality position");
        let position;
        if(project.owner._id.toString()===req.user.id){
            position="Owner";
        }else{
            const userPosition=await teamModel.findOne({projectId:projectId,member:req.user.id}).select("position");
            position=userPosition.position;
        }
        return res.json({msg:"success",project:project,progress:progress,myTask:myTaskLength,teamLength:totalTeamMembers,recentTasks:recentTasks,recentActivity:recentActivity,teamMembers:teamMembers,position:position});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

module.exports={getOverviewInfo};