const mongoose=require("mongoose");
const crypto=require("crypto");

const emailVarificationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newUser",
        require:true
    },
    token:{
        type:String,
        require:true
    },
    expiresAt:{
        type:Date,
        require:true,
        index:{
            expires:0
        }
    },
    resendAvailableAt:{
        type:Date
    },
    isClick:{
        type:Boolean,
        default:false
    },
    newEmail:{
        type:String,
        require:true,
        lowercase:true,
        trim:true
    }
},{timestamps:true});

emailVarificationSchema.pre("save",function (){
    const user=this;
    const hashedToken=crypto.createHash("sha256")
        .update(user.token)
        .digest("hex");
    this.token=hashedToken;
});

const newEmailVarificationModel=mongoose.model("newEmailVarificationModel",emailVarificationSchema);
module.exports=newEmailVarificationModel;