const express=require("express");
const activityModel=require("../models/acitivityModel.js");

async function createActivity(actor,msg,projectId,type,res){
    try{
        await activityModel.create({
            projectId:projectId,
            actor:actor,
            type:type,
            message:msg
        });
        console.log("hello bro activity");
        return;
    }catch(err){
        console.log("Error:",err);
        return res.json({error:"something went wrong"});
    }
}

async function getActivities(req,res){
    try{
        const projectId=req.params.projectId;
        const activity=await activityModel.find({projectId:projectId});
        return res.json({activity:activity,msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({error:"something went wrong"});
    }
}

module.exports={createActivity,getActivities};