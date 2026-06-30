const mongoose=require("mongoose");
const crypto=require("crypto");

mongoose.connect("mongodb://127.0.0.1:27017/DevFlow")
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
    }
},{timestamps:true});

userSignUpSchema.pre("save",function (next){
    const user=this;
    if(!user.isModified("password")) return;
    const salt=crypto.randomBytes(16).toString();
    const hashedPassword=crypto.createHmac("sha256",salt)
        .update(user.password)
        .digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
})

const newUser=mongoose.model("newUser",userSignUpSchema);

module.exports=newUser;