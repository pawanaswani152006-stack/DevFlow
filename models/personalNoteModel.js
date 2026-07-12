const mongoose=require("mongoose");

const personalNoteSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newProject",
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        require:true
    },
    note:{
        type:String,
        require:true,
        trim:true
    }
},{timestamps:true});

const personalNoteModel=mongoose.model("personalNoteModel",personalNoteSchema);
module.exports=personalNoteModel;