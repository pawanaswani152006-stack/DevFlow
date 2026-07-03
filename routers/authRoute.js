const express=require("express");
const router=express.Router();
let {createUser,varifyUser,isSuccess}=require("../controllers/authControl.js");
const checkAuth=require("../middlewares/dash.js");
const path=require("path");

router.get("/",(req,res)=>{
    return res.redirect("index.html");
});

router.post("/signUp",(req,res)=>{
    createUser(req,res);
});

router.post("/signIn",(req,res)=>{
    varifyUser(req,res);
});

router.get("/dashboard",checkAuth,(req,res)=>{
    try{
        res.sendFile(path.join(__dirname
            ,"..",
            "private",
            "dashboard.html"
        ));
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
    
})

module.exports=router;