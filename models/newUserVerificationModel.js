const mongoose=require("mongoose");
let userSignUpSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    expiresAt:{
        type:Date,
        require:true,
        index:{
            expires:0
        }
    }
},{timestamps:true});

const newUserVerificationModel=mongoose.model("newUserVerifiactionModel",userSignUpSchema);

module.exports=newUserVerificationModel;