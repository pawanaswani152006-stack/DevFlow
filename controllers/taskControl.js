const express=require("express");
const taskModel=require("../models/taskModel.js");
const newUser=require("../models/logIn.js");
const teamModel=require("../models/teamModel.js");
const project=require("../models/dashboard.js");

async function createTask(req,res){
    try{
        const body=req.body;
        const {task,assignedTo,priority,taskDeadline}=body;
        if(!task){
            return res.json({taskMsg:"Task can not be empty"});
        }
        if(!assignedTo){
            return res.json({assignMsg:"Member must be select to assign task"});
        }
        if(!priority){
            return res.json({priorityMsg:"priority must not be empty"});
        }
        if(!taskDeadline){
            return res.json({taskDeadlineMsg:"Deadline must not be empty"});
        }
        let deadline=new Date(taskDeadline);
        let today=new Date();
        today.setHours(0,0,0,0);
        deadline.setHours(0,0,0,0);
        if(today>deadline){
            return res.json({msg:"deadline can't be in past."});
        }
        if(isNaN(deadline.getTime())){
            return res.json({msg:"invalid deadline"});
        }
        const projectId=req.params.projectId;
        const createdTask=await taskModel.create({
            projectId:projectId,
            task:task,
            assignedTo:assignedTo,
            assignedBy:req.user.id,
            priority:priority,
            deadline:taskDeadline
        });
        const assignedName=await taskModel.findById(createdTask._id).populate("assignedTo","fullName");
        return res.json({createdTask:assignedName});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
}

async function getTasks(req,res){
    try{
        const projectId=req.params.projectId;
        const allTasks=await taskModel.find({projectId:projectId}).populate("assignedTo","fullName");
        const currUser=await newUser.findById(req.user.id).select("fullName");
        const owner=await project.findById(projectId).select("owner")
        let ownerId=owner.owner.toString();
       
        if(req.user.id===ownerId){
            return res.json({allTasks:allTasks,user:currUser,userRole:"Owner"});
        }
        const userRole=await teamModel.findOne({projectId:projectId,member:req.user.id}).select("position");
        console.log(currUser);
        return res.json({allTasks:allTasks,user:currUser,userRole:userRole.position});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
    
}

module.exports={createTask,getTasks};