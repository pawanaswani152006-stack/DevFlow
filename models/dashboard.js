const mongoose=require("mongoose");

const projectSchema=new mongoose.Schema({
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        required:true
    },
    projectName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    trackingMode:{
        type:String,
        required:true
    },
    deadline:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Active"
    },
    isArchived:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const project=mongoose.model("newProject",projectSchema);
module.exports=project;