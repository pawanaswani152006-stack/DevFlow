const express=require("express");
const router=express.Router();
let {createUser,varifyUser,emailVarification,getUser,goDashboard,resendEmail,getEmail,changeEmail,resendTime,sendLink,emailVarificationForResetPassword,checkForResetPass,cancelResetPassProcess,setNewPassword,resendResetPassLink,isSuccess}=require("../controllers/authControl.js");
const checkAuth=require("../middlewares/dash.js");
const path=require("path");

router.get("/",(req,res)=>{
    return res.redirect("index.html");
});

router.get("/verifyEmail",(req,res)=>{
    try{
        emailVarification(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/verifyEmailForPass",(req,res)=>{
    try{
        emailVarificationForResetPassword(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/checkForResetPass",(req,res)=>{
    try{
        checkForResetPass(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/cancelResetPassProcess",(req,res)=>{
    try{
        cancelResetPassProcess(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/verify",(req,res)=>{
    try{
        getUser(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/userVarified/:userId",(req,res)=>{
    try{
        goDashboard(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/getEmail/:userId",(req,res)=>{
    try{
        getEmail(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.patch("/changeEmail/:userId",(req,res)=>{
    try{
        changeEmail(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/resendEmail/:userId",(req,res)=>{
    try{
        resendEmail(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/resendResetPassLink/:userId",(req,res)=>{
    try{
        resendResetPassLink(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/resendTime/:userId",(req,res)=>{
    try{
        resendTime(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.post("/signUp",(req,res)=>{
    try{
        createUser(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
});

router.post("/resetPass",(req,res)=>{
    try{
        sendLink(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
});

router.patch("/setNewPassword",(req,res)=>{
    try{
        setNewPassword(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
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