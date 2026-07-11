const express=require("express");
const taskModel=require("../models/taskModel.js");
const newUser=require("../models/logIn.js");
const teamModel=require("../models/teamModel.js");
const project=require("../models/dashboard.js");
const {createActivity}=require("./activityControl.js");

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
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} assigned a task to "${assignedName.assignedTo.fullName}"`
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"task_created",res);
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
        return res.json({allTasks:allTasks,user:currUser,userRole:userRole.position});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
    
}

async function deleteTask(req,res){
    try{
        console.log("hello deleted");
        const taskId=req.params.taskId;
        const assignedName=await taskModel.findById(taskId).populate("assignedTo","fullName").select("assignedTo");
        await taskModel.findByIdAndDelete(taskId);
        const actorName=await newUser.findById(req.user.id).select("fullName");
        console.log(assignedName);
        const activityMessage=`${actorName.fullName} deleted a task which is assigned to "${assignedName.assignedTo.fullName}"`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"task_deleted",res);
        return res.json({msg:"Success"});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
}

async function getStatus(req,res){
    try{
        const projectId=req.params.projectId;
        const taskId=req.params.taskId;
        const status=await taskModel.findById(taskId);
        const names=await teamModel.find({projectId:projectId}).populate("member","fullName").select("member");
        return res.json({currStatus:status.status,task:status,names:names});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
}

async function updateStatus(req,res){
    try{
        const body=req.body;
        const taskId=req.params.taskId;
        const status=await taskModel.findByIdAndUpdate(taskId,{
            status:body.newStatus
        });
        const assignedName=await taskModel.findById(taskId).populate("assignedTo","fullName").select("assignedTo");
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} update status of task , which is assigned to "${assignedName.assignedTo.fullName}" , to ${body.newStatus}`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"task_status_changed",res);
        return res.json({success:"true"});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
}

async function editTaskCard(req,res){
    try{
        console.log("method per aa gya");
        const body=req.body;
        const {task,assignTo,priority,deadline}=body;
        const taskId=req.params.taskId;
        console.log(body);
        if(!task){
            return res.json({taskMsg:"Task can not be empty"});
        }
        if(!assignTo){
            return res.json({assignMsg:"Member must be select to assign task"});
        }
        if(!priority){
            return res.json({priorityMsg:"priority must not be empty"});
        }
        if(!deadline){
            return res.json({taskDeadlineMsg:"Deadline must not be empty"});
        }
        let customizedDeadline=new Date(deadline);
        let today=new Date();
        today.setHours(0,0,0,0);
        customizedDeadline.setHours(0,0,0,0);
        if(today>customizedDeadline){
            return res.json({msg:"deadline can't be in past."});
        }
        if(isNaN(customizedDeadline.getTime())){
            return res.json({msg:"invalid deadline"});
        }
        console.log("paar");
        await taskModel.findByIdAndUpdate(taskId,{
            task:task,
            assignedTo:assignTo,
            priority:priority,
            deadline:customizedDeadline
        });
        const assignedName=await taskModel.findById(taskId).populate("assignedTo","fullName").select("assignedTo");
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} edit task , which is currently assigned to "${assignedName.assignedTo.fullName}"`;
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"task_updated",res);
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"Something went wrong"});
    }
}

module.exports={createTask,getTasks,deleteTask,getStatus,updateStatus,editTaskCard};