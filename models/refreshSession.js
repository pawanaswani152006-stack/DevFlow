const mongoose=require("mongoose");

const refreshSessionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"newUser"
    },
    jti:{
        type:String,
        require:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        require:true,
        index:{
            expires:0
        }
    }
},{timestamps:true});

const sessionModel=mongoose.model("sessionModel",refreshSessionSchema);
module.exports=sessionModel;