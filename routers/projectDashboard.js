const express=require("express");
const router1=express.Router();
const checkAuth=require("../middlewares/dash.js");
const createProject=require("../controllers/dashControl.js");


router1.get("/",checkAuth,(req,res)=>{
    return res.status(200);
})
router1.post("/",checkAuth,(req,res)=>{
    createProject(req,res);
})

module.exports=router1;