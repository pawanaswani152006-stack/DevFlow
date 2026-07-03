const express=require("express");
const teamModel=require("../models/teamModel.js");
const newUser=require("../models/logIn.js");
const validator=require("validator");
const projectModel=require("../models/dashboard.js");

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
            email:memberEmail
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
        return res.json({team:teamMembers,owner:owner.owner.fullName});
    }catch(err){
        console.log("error:",err);
        return res.json({err:"something went worng"});
    }  
}
module.exports={addTeamMember,getTeamMembers};