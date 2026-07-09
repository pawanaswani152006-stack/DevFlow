const mongoose=require("mongoose");

const activitySchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"newProject"
    },
    actor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"newUser"
    },
    type:{
        type:String,
        required:true,
        enum:[
            "task_created",
            "task_updated",
            "task_deleted",
            "task_status_changed",
            "member_invited",
            "member_removed",
            "role_changed"
        ]
    },
    message:{
        type:String,
        required:true
    }
},{timestamps:true});

const activityModel=mongoose.model("activityModel",activitySchema);
module.exports=activityModel;