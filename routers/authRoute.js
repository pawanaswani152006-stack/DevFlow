const express=require("express");
const router=express.Router();
let {createUser,varifyUser,emailVarification,getUser,goDashboard,resendEmail,getEmail,changeEmail,resendTime,sendLink,emailVarificationForResetPassword,checkForResetPass,cancelResetPassProcess,setNewPassword,resendResetPassLink,passResendTime,isSuccess}=require("../controllers/authControl.js");
const {checkAuth,checkForLogIn}=require("../middlewares/dash.js");
const path=require("path");

router.get("/",checkForLogIn,(req,res)=>{
    return res.redirect("index.html");
});

router.get("/verifyEmail",checkForLogIn,(req,res)=>{
    try{
        emailVarification(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/verifyEmailForPass",checkForLogIn,(req,res)=>{
    try{
        emailVarificationForResetPassword(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/checkForResetPass",checkForLogIn,(req,res)=>{
    try{
        checkForResetPass(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/cancelResetPassProcess",checkForLogIn,(req,res)=>{
    try{
        cancelResetPassProcess(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/verify",checkForLogIn,(req,res)=>{
    try{
        getUser(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/userVarified/:userId",checkForLogIn,(req,res)=>{
    try{
        goDashboard(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/getEmail/:userId",checkForLogIn,(req,res)=>{
    try{
        getEmail(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.patch("/changeEmail/:userId",checkForLogIn,(req,res)=>{
    try{
        changeEmail(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/resendEmail/:userId",checkForLogIn,(req,res)=>{
    try{
        resendEmail(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/resendResetPassLink/:userId",checkForLogIn,(req,res)=>{
    try{
        resendResetPassLink(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/passResendTime/:userId",checkForLogIn,(req,res)=>{
    try{
        passResendTime(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.get("/resendTime/:userId",checkForLogIn,(req,res)=>{
    try{
        resendTime(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
})

router.post("/signUp",checkForLogIn,(req,res)=>{
    try{
        createUser(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
});

router.post("/resetPass",checkForLogIn,(req,res)=>{
    try{
        sendLink(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
});

router.patch("/setNewPassword",checkForLogIn,(req,res)=>{
    try{
        setNewPassword(req,res);
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong."});
    }
});

router.post("/signIn",checkForLogIn,(req,res)=>{
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

router.get("/canGoDashboard",(req,res)=>{
    try{
        return res.json({msg:"authenticated"});
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    } 
})

router.get("/canGoSignPage",checkForLogIn,(req,res)=>{
    try{
        return res.json({msg:"success"});
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    } 
})

module.exports=router;