const express=require("express");
const router1=express.Router();
const checkAuth=require("../middlewares/dash.js");
const {createProj,getProjects}=require("../controllers/dashControl.js");
const path=require("path");
const {addTeamMember,getTeamMembers,manageTeamMember,updateRole,deleteMember}=require("../controllers/teamControl.js");
const restrictTo=require("../middlewares/authorization.js");


router1.get("/",checkAuth,(req,res)=>{
    getProjects(req,res);
})
router1.post("/",checkAuth,(req,res)=>{
    createProj(req,res);
})

router1.get("/:projectId",checkAuth,(req,res)=>{
    try{
        res.sendFile(path.join(__dirname
            ,"..",
            "private",
            "dashProject.html"
        ));
    }catch(err){
            console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.post("/:projectId/team",checkAuth,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        addTeamMember(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/team",checkAuth,(req,res)=>{
    try{
        getTeamMembers(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/team/manage",checkAuth,restrictTo("Owner"),(req,res)=>{
    try{
        manageTeamMember(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.patch("/:projectId/team/manage/:teamId",checkAuth,restrictTo("Owner"),(req,res)=>{
    try{
        updateRole(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/:projectId/team/manage/:teamId",checkAuth,restrictTo("Owner"),(req,res)=>{
    try{
        deleteMember(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

module.exports=router1;