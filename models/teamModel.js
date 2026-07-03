const mongoose=require("mongoose");
const teamSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newProject",
        required:true
    },
    member:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        required:true
    },
    memberEmail:{
        type:String,
        require:true,
    },
    position:{
        type:String,
        required:true
    },
    spaciality:{
        type:String,
        required:true
    },
    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        required:true
    }
},{timestamps:true});
teamSchema.index(
    {projectId:1 , memberEmail:1},
    {unique:true}
);
const teamModel=mongoose.model("teamModel",teamSchema);
module.exports=teamModel;