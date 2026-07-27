const express=require("express");
const teamModel=require("../models/teamModel.js");
const newUser=require("../models/logIn.js");
const validator=require("validator");
const projectModel=require("../models/dashboard.js");
const {createActivity}=require("./activityControl.js");

async function addTeamMember(req,res){
    try{
        const body=req.body;
        const projectId=req.params.projectId;
        const {memberEmail,spaciality,position}=body;
        if(!memberEmail){
            return res.json({emailMsg:"please provide email"});
        }
        if(!spaciality){
            return res.json({spacialityMsg:"please provide spaciality"});
        }
        if(!position){
            return res.json({positionMsg:"please provide position"});
        }
        if(!validator.isEmail(memberEmail)){
            return res.json({emailValidMsg:"please provide a valid email"});
        }
        const user=await newUser.findOne({email:memberEmail});
        if(!user){
            return res.json({userExistMsg:"Email doesn't exists"});
        }
        const owner=await projectModel.findById(projectId).select("owner");
        if(user._id.toString()===owner.owner.toString()){
            return res.json({msg:"member already exist."});
        }
        const memberExist=await teamModel.findOne({
            projectId:projectId,
            memberEmail:memberEmail
        })
        if(memberExist){
            return res.json({existMsg:"Already in your team"});
        }
        const member=await teamModel.create({
            projectId:projectId,
            member:user._id,
            memberEmail:memberEmail,
            position:position,
            spaciality:spaciality,
            invitedBy:req.user.id
        });
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} add new team member "${user.fullName}"`
        createActivity(req.user.id.toString(),activityMessage,projectId,"member_invited",res);
        return res.json({
            msg:"success"
        })

    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
}

async function getTeamMembers(req,res){
    try{
        const projectId=req.params.projectId;
        const teamMembers=await teamModel.find({projectId}).populate("member","fullName");
        return res.json({msg:"success",team:teamMembers});
    }catch(err){
        console.log("error:",err);
        return res.json({err:"something went worng"});
    }  
}

async function manageTeamMember(req,res){
    try{
        const projectId=req.params.projectId;
        if(req.position==="Owner"){
            const allMembers=await teamModel.find({projectId:projectId}).populate("member","fullName");
            return res.json({msg:"success",arr:allMembers});
        }
    }catch(err){
        console.log("error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

async function updateRole(req,res){
    try{
        console.log("hello");
        const teamId=req.params.teamId;
        const team=await teamModel.findById(teamId).select("position");
        const newPosition=team.position==="Admin"?"Member":"Admin";
        console.log("yha");
        const updated=await teamModel.findByIdAndUpdate(teamId,{
            position:newPosition
        },{
            new:true
        })
        const user=await teamModel.findById(teamId).populate("member","fullName").select("member");
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} changed role of "${user.member.fullName}" to ${newPosition}`
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"role_changed",res);
        console.log("hello bro");
        return res.json({msg:"success",updatedPosition:newPosition});
    }catch(err){
        console.log("error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

async function deleteMember(req,res){
    try{
        const teamId=req.params.teamId;
        const user=await teamModel.findById(teamId).populate("member","fullName").select("member");
        await teamModel.findByIdAndDelete(teamId);
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} removed "${user.member.fullName}" from team`
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"member_removed",res);
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

async function getTeamMembersName(req,res){
    try{
        const projectId=req.params.projectId;
        const names=await teamModel.find({projectId:projectId}).populate("member","fullName").select("member");
        if(!names){
            return res.json({msg:"failed"});
        }
        return res.json({msg:"success",names:names});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

module.exports={addTeamMember,getTeamMembers,manageTeamMember,updateRole,deleteMember,getTeamMembersName};