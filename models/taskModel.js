const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newProject",
        required:true
    },
    task:{
        type:String,
        trim:true,
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        required:true
    },
    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        required:true
    },
    priority:{
        type:String,
        required:true,
        enum:["Low","Medium","High"],
    },
    status:{
        type:String,
        enum:["Todo","In Progress","Completed"],
        default:"Todo"
    },
    deadline:{
        type:Date,
        required:true
    }
},{timestamps:true});

const taskModel=mongoose.model("taskModel",taskSchema);
module.exports=taskModel;