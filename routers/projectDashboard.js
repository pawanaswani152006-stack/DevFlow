const express=require("express");
const router1=express.Router();
const checkAuth=require("../middlewares/dash.js");
const {createProj,getProjects}=require("../controllers/dashControl.js");
const path=require("path");


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
            return res.redirect("/?mode1=signIn.html");
    }
})

module.exports=router1;