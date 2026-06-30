const express=require("express");
const newUser=require("../models/logIn.js");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const validator=require("validator");

const secretKey="$$p@w@n$$#";
let isSuccess=false;

async function createUser(req,res){
    try{
        const body=req.body;
        const {fullName,email,password,reEnteredPassword}=body;
        const existingUser=await newUser.findOne({email});
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
            });
        }
        if(existingUser){
            return res.status(409).json({alreadyMsg:"email alrealdy exist!"});
        }
        if(password.length<8){
            return res.status(400).json({passMsg:"password should be 8 characters long."});
        }
        if(password!==reEnteredPassword){
            return res.status(400).json({reMsg:"Re-entered password is different."});
        }
        const user=await newUser.create({
            fullName:fullName,
            email:email,
            password:password
        });
        const token=await jwt.sign({
            id:user._id,
            email:user.email
        },secretKey);
        res.cookie("Token",token,{
            httpOnly:true,
            maxAge:60 * 60 * 1000
        });
        return res.json({
                isSuccess:true,
                msg:"success",
                redirectTo:"/dashboard"
            });
    }catch(err){
        console.log("Error:",err);
        return res.status(500).json({msg:"Something went wrong."});
    }
};
async function varifyUser(req,res){
    try{
        let body=req.body;
        let {email,password}=body;
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
        });
        }
        let user=await newUser.findOne({email});
        if(!user){
            return res.json({msg1:"Invalid email or password!"});
        }
        let salt=user.salt;
        const hashedPassword=await crypto.createHmac("sha256",salt)
                .update(password)
                .digest("hex");
        if(hashedPassword===user.password){
            const token=await jwt.sign({
                id:user._id,
                email:user.email
            },secretKey);
            res.cookie("Token",token,{
                httpOnly:true,
                maxAge:60 * 60 * 1000
            });
            return res.json({
                isSuccess:true,
                msg:"success",
                redirectTo:"/dashboard"
            });
        }else{
            return res.json({msg2:"Invalid email or password!"});
        }
    }catch(error){
        return res.json({msg3:"Something went wrong."});
    }
};

module.exports={
    createUser,
    varifyUser,
    isSuccess
};