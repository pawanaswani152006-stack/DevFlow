const express=require("express");
const multer=require("multer");
const router1=express.Router();
const checkAuth=require("../middlewares/dash.js");
const {createProj,getProjects}=require("../controllers/dashControl.js");
const path=require("path");
const {addTeamMember,getTeamMembers,manageTeamMember,updateRole,deleteMember,getTeamMembersName}=require("../controllers/teamControl.js");
const restrictTo=require("../middlewares/authorization.js");
const {createTask,getTasks,deleteTask,getStatus,updateStatus,editTaskCard}=require("../controllers/taskControl.js");
const {getActivities}=require("../controllers/activityControl.js");
const {getOptions,getMessages,deleteMsg,editMsg}=require("../controllers/chatControl.js");
const {createNote,getNotes,deleteNote,editNote,pdf,getPdf}=require("../controllers/notesControl.js");

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:50*1024*1024
    }
});

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

router1.get("/:projectId/task/names",checkAuth,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        getTeamMembersName(req,res);
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

router1.post("/:projectId/task",checkAuth,restrictTo("Owner","Admin"),(req,res)=>{
    try{
        createTask(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.get("/:projectId/task",checkAuth,(req,res)=>{
    try{
        getTasks(req,res);
    }catch(err){
        console.log("error",err);
        return res.json({msg:"something went wrong"});
    }
})

router1.delete("/:projectId/task/:taskId",checkAuth,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        deleteTask(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/task/:taskId",checkAuth,(req,res)=>{
    try{
        getStatus(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/task/:taskId",checkAuth,(req,res)=>{
    try{
        updateStatus(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/task/:taskId/edit",checkAuth,restrictTo("Admin","Owner"),(req,res)=>{
    try{
        console.log("hello shi aaya hue");
        editTaskCard(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/activity",checkAuth,(req,res)=>{
    try{
        getActivities(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/discussion",checkAuth,(req,res)=>{
    try{
        getOptions(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/chat/:roomId",checkAuth,(req,res)=>{
    try{
        getMessages(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/chat/:msgId",checkAuth,(req,res)=>{
    try{
        deleteMsg(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/chat/:msgId",checkAuth,(req,res)=>{
    try{
        editMsg(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.post("/:projectId/personalNote",checkAuth,(req,res)=>{
    try{
        createNote(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/personalNote",checkAuth,(req,res)=>{
    try{
        getNotes(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.patch("/:projectId/personalNote/:noteId",checkAuth,(req,res)=>{
    try{
        editNote(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.delete("/:projectId/personalNote/:noteId",checkAuth,(req,res)=>{
    try{
        deleteNote(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.post("/:projectId/pdf",checkAuth,upload.single("pdf"),(req,res)=>{
    try{
        pdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

router1.get("/:projectId/pdf",checkAuth,(req,res)=>{
    try{
        console.log("hello bro");
        getPdf(req,res);
    }catch(err){
        console.log("Error:",err);
        res.json({msg:"something went wrong."});
    }
})

module.exports=router1;