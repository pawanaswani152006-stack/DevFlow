const express=require("express");
const personalNoteModel=require("../models/personalNoteModel.js");
const cloudinary = require("../config/cloudinary");

async function createNote(req,res){
    try{
        const body=req.body;
        const projectId=req.params.projectId;
        const note=body.note;
        if(!note){
            return res.json({msg:"provide your note"});
        }
        const createdNote=await personalNoteModel.create({
            projectId:projectId,
            userId:req.user.id,
            note:note
        });
        return res.json({createdNote:createdNote});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong"});
    }
}

async function getNotes(req,res){
    try{
        const projectId=req.params.projectId;
        const personalNotes=await personalNoteModel.find({projectId:projectId,userId:req.user.id})
        return res.json({personalNotes:personalNotes,msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong"});
    }
}

async function deleteNote(req,res){
    try{
        const noteId=req.params.noteId;
        await personalNoteModel.findByIdAndDelete(noteId);
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong"});
    }
}

async function editNote(req,res){
    try{
        const body=req.body;
        const noteId=req.params.noteId;
        await personalNoteModel.findByIdAndUpdate(noteId,{
            note:body.note
        });
        return res.json({msg:"success"});
    }catch(err){
        console.log("Error:",err);
        return res.json({msg:"something went wrong"});
    }
}

function uploadPdf(buffer) {
    console.log("1. uploadPdf entered");

    return new Promise((resolve, reject) => {

        console.log("2. Promise started");

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "devflow/pdfs"
            },
            (error, result) => {

                console.log("3. Cloudinary callback fired");

                if (error) {
                    console.log("CLOUDINARY ERROR:", error);
                    reject(error);
                    return;
                }

                console.log("CLOUDINARY RESULT:", result);

                resolve(result);
            }
        );

        uploadStream.on("error", (error) => {
            console.log("STREAM ERROR:", error);
            reject(error);
        });

        console.log("4. Before stream end");

        uploadStream.end(buffer);

        console.log("5. After stream end");
    });
}

async function pdf(req, res) {
    try {
        console.log({
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
            secretExists: !!process.env.CLOUDINARY_API_SECRET
        });
        console.log("A. Controller entered");

        const uploadedPdf = await uploadPdf(req.file.buffer);

        console.log("B. Upload returned");
        console.log(uploadedPdf);

        return res.json({
            success: true
        });

    } catch (err) {
        console.log("UPLOAD ERROR:", err);

        return res.status(500).json({
            success: false,
            msg: "Upload failed"
        });
    }
}

module.exports={createNote,getNotes,deleteNote,editNote,pdf};