const express=require("express");
const router1=express.Router();
const checkAuth=require("../middlewares/dash.js");
const {createProj,getProjects}=require("../controllers/dashControl.js");


router1.get("/",checkAuth,(req,res)=>{
    getProjects(req,res);
})
router1.post("/",checkAuth,(req,res)=>{
    createProj(req,res);
})

module.exports=router1;