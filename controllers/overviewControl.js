const express=require("express");
const newUser=require("../models/logIn.js");
const projectModel=require("../models/dashboard.js");
const taskModel=require("../models/taskModel.js");
const teamModel=require("../models/teamModel.js");
const activity=require("../models/acitivityModel.js");
const chatModel=require("../models/chatModel.js");
const pdfModel=require("../models/pdfModel.js");
const personalNoteModel=require("../models/personalNoteModel.js");
const {createActivity}=require("./activityControl.js");

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

async function projectUpdate(req,res){
    try{
        const projectId=req.params.projectId;
        const body=req.body;
        const {projectName,deadline,description}=body;
        if(!projectName || !deadline || !description){
            return res.json({msg:"failed"});
        }
        const deadlineDate=new Date(deadline);
        const today=new Date();
        deadlineDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        if(today>deadlineDate){
            return res.jaon({msg:"Deadline can't be found."});
        }
        const project=await projectModel.findByIdAndUpdate(projectId,{
            projectName:projectName,
            deadline:deadlineDate,
            description:description
        },{
            new:true
        });
        const user=await newUser.findById(req.user.id).select("fullName")
        const activityMessage=`${user.fullName} do some changes in project.`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"project_related",res);
        return res.json({msg:"success",project:project});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

async function updateProjectStatus(req,res){
    try{
        const projectId=req.params.projectId;
        const body=req.body;
        const status=body.status;
        if(!status){
            return res.json({msg:"status can't be empty."});
        }
        const project=await projectModel.findByIdAndUpdate(projectId,{
            status:status
        });
        const user=await newUser.findById(req.user.id).select("fullName")
        const activityMessage=`${user.fullName} changed the status of project to ${status}.`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"project_related",res);
        return res.json({msg:"success",status:status});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

async function deleteProject(req,res){
    try{
        const projectId=req.params.projectId;
        await taskModel.deleteMany({projectId:projectId});
        await teamModel.deleteMany({projectId:projectId});
        await activity.deleteMany({projectId:projectId});
        await chatModel.deleteMany({projectId:projectId});
        await pdfModel.deleteMany({projectId:projectId});
        await personalNoteModel.deleteMany({projectId:projectId});
        await projectModel.findByIdAndDelete(projectId);
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

module.exports={
    getOverviewInfo,
    projectUpdate,
    updateProjectStatus,
    deleteProject
};