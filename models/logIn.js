const mongoose=require("mongoose");
const crypto=require("crypto");

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Data base is connected."))
    .catch((err)=>console.log("Error:",err));

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
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

userSignUpSchema.pre("save",function (){
    const user=this;
    if(!user.isModified("password")) return;
    const salt=crypto.randomBytes(16).toString("hex");
    const hashedPassword=crypto.createHmac("sha256",salt)
        .update(user.password)
        .digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
});

const newUser=mongoose.model("newUser",userSignUpSchema);

module.exports=newUser;