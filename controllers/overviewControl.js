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
const cloudinary = require("../config/cloudinary");

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
        await Promise.all([
            taskModel.deleteMany({projectId:projectId}),
            teamModel.deleteMany({projectId:projectId}),
            activity.deleteMany({projectId:projectId}),
            chatModel.deleteMany({projectId:projectId}),
            pdfModel.deleteMany({projectId:projectId}),
            personalNoteModel.deleteMany({projectId:projectId})
        ])
        await projectModel.findByIdAndDelete(projectId);
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

async function transferOwnership(req,res){
    try{
        const projectId=req.params.projectId;
        const body=req.body;
        const {member,newPosition,spaciality}=body;
        if(!member || !newPosition || !spaciality){
            return res.json({msg:"all info are required."});
        }
        const existingMember=await teamModel.findOne({member:member.toString()}).populate("member","fullName");
        if(!existingMember){
            return res.json({msg:"Selected Member is not exist in team."});
        }
        const project=await projectModel.findByIdAndUpdate(projectId,{
            owner:existingMember.member
        });
        const existingUser=await newUser.findById(req.user.id).select("fullName email");
        await teamModel.findByIdAndDelete(existingMember._id);
        await teamModel.create({
            projectId:projectId,
            member:req.user.id,
            memberEmail:existingUser.email,
            position:newPosition,
            spaciality:spaciality,
            invitedBy:req.user.id
        });
        const activityMessage=`${existingUser.fullName} transfer the ownership of project to ${existingMember.member.fullName}.`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"project_related",res);
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

async function leaveTeam(req,res){
    try{
        const projectId=req.params.projectId;
        const userId=req.user.id;
        const user=await newUser.findById(userId).select("fullName");
        const pdfs=await pdfModel.find({projectId:projectId,sender:userId,scope:"personal"}).select("storageId");
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
            personalNoteModel.deleteMany({projectId:projectId,userId:userId}),
            pdfModel.deleteMany({projectId:projectId,sender:userId,scope:"personal"}),
            chatModel.deleteMany({projectId:projectId,chatType:"dm",sender:userId}),
            chatModel.deleteMany({projectId:projectId,chatType:"dm",receiver:userId}),
            teamModel.findOneAndDelete({projectId:projectId,member:userId})
        ]);
        const activityMessage=`${user.fullName} leave team.`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"member_removed",res);
        return res.json({msg:"success"})
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
}

module.exports={
    getOverviewInfo,
    projectUpdate,
    updateProjectStatus,
    deleteProject,
    transferOwnership,
    leaveTeam
};