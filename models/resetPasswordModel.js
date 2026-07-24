const mongoose=require("mongoose");
const crypto=require("crypto");

const resetPassSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"newUser"
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
    isVerified:{
        type:Boolean,
        default:false
    },
    isUsed:{
        type:Boolean,
        default:false
    },
    resendAvailableAt:{
        type:Date
    }
},{timestamps:true});

resetPassSchema.pre("save",function (){
    const user=this;
    const hashedToken=crypto.createHash("sha256")
        .update(user.token)
        .digest("hex");
    this.token=hashedToken;
});

const resetPassModel=mongoose.model("resetPassModel",resetPassSchema);
module.exports=resetPassModel;