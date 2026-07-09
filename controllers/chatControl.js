const express=require("express");
const teamModel=require("../models/teamModel.js");
const project=require("../models/dashboard.js");

async function getOptions(req,res){
    try{
        const projectId=req.params.projectId;
        const options=await teamModel.find({projectId:projectId}).populate("member","fullName").select("member");
        const teamOption=await project.findById(projectId).populate("owner","fullName").select("owner projectName");
        return res.json({memberList:options,specialOption:teamOption});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong"});
    }
}

module.exports={getOptions};