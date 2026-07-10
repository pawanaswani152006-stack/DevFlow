const express=require("express");
const teamModel=require("../models/teamModel.js");
const project=require("../models/dashboard.js");
const chatModel=require("../models/chatModel.js");

async function getOptions(req,res){
    try{
        const projectId=req.params.projectId;
        const options=await teamModel.find({projectId:projectId}).populate("member","fullName").select("member");
        const teamOption=await project.findById(projectId).populate("owner","fullName").select("owner projectName");
        return res.json({memberList:options,specialOption:teamOption,currUserId:req.user.id});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong"});
    }
}

async function saveMessageInfo(body){
    try{
        const {projectId,roomId,chatType,sender,receiver,message}=body;
        if(!projectId){
            return "provide id of project";
        }
        if(!roomId){
            return "provide roomId";
        }
        if(!chatType){
            return "provide type of chat";
        }
        if(!sender){
            return "provide id of sender";
        }
        if(chatType==="dm"){
            if(!receiver){
                return "provide id of receiver";
            }
        }
        if(!message){
            return "provide a valid message";
        }
        const createdMsg=await chatModel.create({
            projectId:projectId,
            roomId:roomId,
            chatType:chatType,
            sender:sender,
            receiver:receiver,
            message:message
        });
        console.log(createdMsg);
        return createdMsg;
    }catch(err){
        console.log("Error:",err);
        return;
    }
}

module.exports={getOptions,saveMessageInfo};