const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.SchemaTypes.ObjectId,
        require:true,
        ref:"newProject"
    },
    roomId:{
        type:String,
        require:true,
        index:true
    },
    chatType:{
        type:String,
        enum:["team","dm"],
        require:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"newUser"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        default:null
    },
    message:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true});

const chatModel=mongoose.model("chatModel",chatSchema);
module.exports=chatModel;