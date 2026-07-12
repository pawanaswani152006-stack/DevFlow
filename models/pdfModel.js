const mongoose=require("mongoose");

const pdfSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newProject",
        require:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        require:true
    },
    pdfName:{
        type:String,
        require:true,
        trim:true
    },
    fileUrl:{
        type:String,
        require:true
    },
    storageId:{
        type:String,
        require:true
    },
    scope:{
        type:String,
        enum:["personal","team"],
        require:true
    }
},{timestamps:true});

const pdfModel=mongoose.model("pdfModel","pdfSchema");
module.exports=pdfModel;