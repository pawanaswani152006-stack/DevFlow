const express=require("express");
const multer=require("multer");
const router1=express.Router();
const {checkAuth,checkForProject}=require("../middlewares/dash.js");
const {createProj,getProjects,getProfile,editName,setNewPass,sendNewEmailChangeLink,verifyEmail,checkForNewEmailVerification,cancelNewEmailSetProcess,resendSetNewEmailLink,resendAvailableTime,logOut,getProjectInfo,deleteAccount}=require("../controllers/dashControl.js");
const path=require("path");
const {addTeamMember,getTeamMembers,manageTeamMember,updateRole,deleteMember,getTeamMembersName,getPosition}=require("../controllers/teamControl.js");
const restrictTo=require("../middlewares/authorization.js");
const {createTask,getTasks,deleteTask,getStatus,getTaskInfo,updateStatus,editTaskCard}=require("../controllers/taskControl.js");
const {getActivities}=require("../controllers/activityControl.js");
const {getOptions,getMessages,deleteMsg,editMsg}=require("../controllers/chatControl.js");
const {createNote,getNotes,deleteNote,editNote,pdf,getPdf,teamPdf,getPdfName,editPdf,deletePdf}=require("../controllers/notesControl.js");
const project=require("../models/dashboard.js");
const {getOverviewInfo,projectUpdate,updateProjectStatus,deleteProject,transferOwnership,leaveTeam}=require("../controllers/overviewControl.js");

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:50*1024*1024
    }
});

router1.get("/",checkAuth,(req,res)=>{
    try{
        getProjects(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/deleteAccount",checkAuth,(req,res)=>{
    try{
        deleteAccount(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/resendAvailableTime",checkAuth,(req,res)=>{
    try{
        resendAvailableTime(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.patch("/resendSetNewEmailLink",checkAuth,(req,res)=>{
    try{
        resendSetNewEmailLink(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/checkForNewEmailVerification",checkAuth,(req,res)=>{
    try{
        checkForNewEmailVerification(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/cancelNewEmailSetProcess",checkAuth,(req,res)=>{
    try{
        cancelNewEmailSetProcess(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/logOut",checkAuth,(req,res)=>{
    try{
        logOut(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/verifyEmail",checkAuth,(req,res)=>{
    try{
        verifyEmail(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.post("/",checkAuth,(req,res)=>{
    try{
        createProj(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.post("/sendNewEmailChangeLink",checkAuth,(req,res)=>{
    try{
        sendNewEmailChangeLink(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.patch("/editName",checkAuth,(req,res)=>{
    try{
        editName(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.patch("/setNewPassword",checkAuth,(req,res)=>{
    try{
        setNewPass(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/getProfile",checkAuth,(req,res)=>{
    try{
        getProfile(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId",checkAuth,checkForProject,async (req,res)=>{
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

router1.patch("/:projectId/projectUpdate",checkAuth,checkForProject,restrictTo("Admin","Owner"),async (req,res)=>{
    try{
        projectUpdate(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.patch("/:projectId/updateProjectStatus",checkAuth,checkForProject,restrictTo("Owner"),async (req,res)=>{
    try{
        updateProjectStatus(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/:projectId/deleteProject",checkAuth,checkForProject,restrictTo("Owner"),async (req,res)=>{
    try{
        deleteProject(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/projectInfo",checkAuth,checkForProject,async (req,res)=>{
    try{
        getProjectInfo(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.post("/:projectId/team",checkAuth,checkForProject,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        addTeamMember(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/team",checkAuth,checkForProject,(req,res)=>{
    try{
        getTeamMembers(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/overview",checkAuth,checkForProject,(req,res)=>{
    try{
        getOverviewInfo(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/task/names",checkAuth,checkForProject,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        getTeamMembersName(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/team/manage",checkAuth,checkForProject,restrictTo("Owner"),(req,res)=>{
    try{
        manageTeamMember(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.patch("/:projectId/team/manage/:teamId",checkAuth,checkForProject,restrictTo("Owner"),(req,res)=>{
    try{
        updateRole(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/:projectId/team/manage/:teamId",checkAuth,checkForProject,restrictTo("Owner"),(req,res)=>{
    try{
        deleteMember(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.post("/:projectId/task",checkAuth,checkForProject,restrictTo("Owner","Admin"),(req,res)=>{
    try{
        createTask(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/task",checkAuth,checkForProject,(req,res)=>{
    try{
        getTasks(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/:projectId/task/:taskId",checkAuth,checkForProject,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        deleteTask(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/task/:taskId",checkAuth,checkForProject,(req,res)=>{
    try{
        getStatus(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/editTask/:taskId",checkAuth,checkForProject,(req,res)=>{
    try{
        getTaskInfo(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/task/:taskId",checkAuth,checkForProject,(req,res)=>{
    try{
        updateStatus(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/task/:taskId/edit",checkAuth,checkForProject,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        console.log("hello shi aaya hue");
        editTaskCard(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/activity",checkAuth,checkForProject,(req,res)=>{
    try{
        getActivities(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/discussion",checkAuth,checkForProject,(req,res)=>{
    try{
        getOptions(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/chat/:roomId",checkAuth,checkForProject,(req,res)=>{
    try{
        getMessages(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/chat/:msgId",checkAuth,checkForProject,(req,res)=>{
    try{
        deleteMsg(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/chat/:msgId",checkAuth,checkForProject,(req,res)=>{
    try{
        editMsg(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.post("/:projectId/personalNote",checkAuth,checkForProject,(req,res)=>{
    try{
        createNote(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/personalNote",checkAuth,checkForProject,(req,res)=>{
    try{
        getNotes(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/personalNote/:noteId",checkAuth,checkForProject,(req,res)=>{
    try{
        editNote(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/personalNote/:noteId",checkAuth,checkForProject,(req,res)=>{
    try{
        deleteNote(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.post("/:projectId/pdf",checkAuth,checkForProject,upload.single("pdf"),(req,res)=>{
    try{
        pdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.post("/:projectId/teamPdf",checkAuth,checkForProject,upload.single("pdf"),restrictTo("Admin","Owner"),(req,res)=>{
    try{
        teamPdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/pdf",checkAuth,checkForProject,(req,res)=>{
    try{
        getPdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/:pdfId/getPdfName",checkAuth,checkForProject,(req,res)=>{
    try{
        getPdfName(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/:pdfId/editTeamPdf",checkAuth,checkForProject,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        editPdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/:pdfId/editPersonalPdf",checkAuth,checkForProject,(req,res)=>{
    try{
        editPdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/:pdfId/deleteTeamPdf",checkAuth,checkForProject,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        deletePdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/:pdfId/deletePersonalPdf",checkAuth,checkForProject,(req,res)=>{
    try{
        deletePdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/transferOwnership",checkAuth,checkForProject,restrictTo("Owner"),(req,res)=>{
    try{
        transferOwnership(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/getPosition",checkAuth,checkForProject,(req,res)=>{
    try{
        getPosition(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/leaveTeam",checkAuth,checkForProject,restrictTo("Member","Admin"),(req,res)=>{
    try{
        leaveTeam(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

module.exports=router1;