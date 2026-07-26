const express=require("express");
const teamModel=require("../models/teamModel.js");
const newUser=require("../models/logIn.js");
const validator=require("validator");
const projectModel=require("../models/dashboard.js");
const {createActivity}=require("./activityControl.js");

async function addTeamMember(req,res){
    try{
        const body=req.body;
        const {projectId , memberEmail , spaciality , position}=body;
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
        const memberExist=await teamModel.findOne({
            projectId:projectId,
            memberEmail:memberEmail
        })
        if(memberExist){
            console.log("yha per");
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
            success:true,
            member:user
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
        const owner=await projectModel.findById(projectId).populate("owner","fullName");
        if(owner.owner._id.toString()===req.user.id){
            return res.json({team:teamMembers,owner:owner.owner.fullName,memberPosition:"Owner",projectName:owner.projectName,deadline:owner.deadline});
        }else{
            const memberPosition=await teamModel.find({projectId:projectId,member:req.user.id}).select("position");
            return res.json({team:teamMembers,owner:owner.owner.fullName,memberPosition:memberPosition[0].position,projectName:owner.projectName});
        }
        
        
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
            return res.json({arr:allMembers});
        }
    }catch(err){
        console.log("error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

async function updateRole(req,res){
    try{
        const teamId=req.params.teamId;
        const team=await teamModel.findById(teamId).select("position");
        const newPosition=team.position==="Admin"?"Member":"Admin";
        const updated=await teamModel.findByIdAndUpdate(teamId,{
            position:newPosition
        },{
            new:true
        })
        const user=await teamModel.findById(teamId).populate("member","fullName").select("member");
        const actorName=await newUser.findById(req.user.id).select("fullName");
        const activityMessage=`${actorName.fullName} changed role of "${user.member.fullName}" to ${newPosition}`
        createActivity(req.user.id.toString(),activityMessage,req.params.projectId,"role_changed",res);
        return res.json({updatedPosition:newPosition});
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
        return res.json({msg:"deleted"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

async function getTeamMembersName(req,res){
    try{
        const projectId=req.params.projectId;
        const names=await teamModel.find({projectId:projectId}).populate("member","fullName").select("member");
        return res.json({names:names});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"Something went wrong."});
    }
}

module.exports={addTeamMember,getTeamMembers,manageTeamMember,updateRole,deleteMember,getTeamMembersName};