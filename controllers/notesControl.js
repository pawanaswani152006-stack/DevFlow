const express=require("express");
const personalNoteModel=require("../models/personalNoteModel.js");
const pdfModel=require("../models/pdfModel.js");
const teamModel=require("../models/teamModel.js");
const project=require("../models/dashboard.js");
const cloudinary = require("../config/cloudinary");
const {createActivity}=require("./activityControl.js");
const newUser = require("../models/logIn.js");

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
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_chunked_stream(
            {
                resource_type: "image",
                folder: "devflow/pdfs",
                chunk_size:5*1024*1024,
                timeout:120000
            },
            (error, result) => {
                if (error) {
                    console.log("CLOUDINARY ERROR:", error);
                    return reject(error);
                }
                console.log("CLOUDINARY RESULT:", result);
                return resolve(result);
            }
        );
        uploadStream.on("error", (error) => {
            console.log("STREAM ERROR:", error);
            reject(error);
        });
        uploadStream.end(buffer);
    });
}

async function pdf(req, res) {
    try {
        cloudinary.api
    .ping()
    .then((result)=> console.log("PING SUCCESS:",result))
    .catch((error)=> console.log("PING ERROR:",error));

        const body=req.body;
        const projectId=req.params.projectId;
        const uploadedPdf = await uploadPdf(req.file.buffer);
        const createdPdf=await pdfModel.create({
            projectId:projectId,
            sender:req.user.id,
            pdfName:body.fileName,
            fileUrl:uploadedPdf.secure_url,
            storageId:uploadedPdf.public_id,
            scope:"personal"
        })
        return res.json({
            msg:"success",
            createdPdf:createdPdf
        });

    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        return res.status(500).json({
            success: false,
            msg: "Upload failed"
        });
    }
}

async function teamPdf(req, res) {
    try {
        const body=req.body;
        const projectId=req.params.projectId;
        const uploadedPdf = await uploadPdf(req.file.buffer);
        const createdPdf=await pdfModel.create({
            projectId:projectId,
            sender:req.user.id,
            pdfName:body.fileName,
            fileUrl:uploadedPdf.secure_url,
            storageId:uploadedPdf.public_id,
            scope:"team"
        })
        const teamPdf=await pdfModel.findById(createdPdf._id).populate("sender","fullName");
        const activityMessage=`${teamPdf.sender.fullName} add new pdf named "${teamPdf.pdfName}".`;
        createActivity(req.user.id.toString(),activityMessage,projectId,"pdf_related",res);
        return res.json({
            msg:"success",
            createdPdf:teamPdf
        });

    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        return res.status(500).json({
            success: false,
            msg: "Upload failed"
        });
    }
}

async function getPdf(req,res){
    try{
        const projectId=req.params.projectId;
        const userId=req.user.id;
        const pdfs=await pdfModel.find({projectId:projectId,sender:userId,scope:"personal"}).select("pdfName fileUrl");
        const team=await pdfModel.find({projectId:projectId,scope:"team"}).populate("sender","fullName").select("pdfName fileUrl sender");
        const ownerId=await project.findById(projectId).select("owner");
        if(ownerId.owner.toString()===userId){
            return res.json({msg:"success",pdfs:pdfs,teamPdfs:team,position:"owner"});
        }
        const position=await teamModel.findOne({projectId:projectId,member:userId}).select("position");
        return res.json({msg:"success",pdfs:pdfs,teamPdfs:team,position:position.position});
    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        return res.status(500).json({
            success: false,
            msg: "Upload failed"
        });
    }
}

async function getPdfName(req,res){
    try{
        const pdfId=req.params.pdfId;
        const projectId=req.params.projectId;
        const userId=req.user.id;
        const pdfName=await pdfModel.findById(pdfId).select("pdfName scope");
        if(!pdfName){
            return res.json({msg:"pdf is not found."});
        }
        let position;
        const existingProject=await project.findById(projectId).select("owner");
        if(userId===existingProject.owner.toString()){
            position="Owner";
        }else{
            const member=await teamModel.findOne({projectId:projectId,member:req.user.id}).select("position");
            position=member.position;
        }
        return res.json({msg:"success",name:pdfName.pdfName,position:position,scope:pdfName.scope});
    }catch (err) {
        console.log("UPLOAD ERROR:", err);
        return res.json({msg:"Something went wrong."});
    }
}

async function editPdf(req,res){
    try{
        const projectId=req.params.projectId;
        const pdfId=req.params.pdfId;
        const body=req.body;
        if(!body.name){
            return res.json({msg:"pdfName can't be empty."});
        }
        const pdf=await pdfModel.findByIdAndUpdate(pdfId,{
            pdfName:body.name.trim()
        });
        if(!pdf){
            return res.json({msg:"pdf can't be found"});
        }
        if(pdf.scope==="team"){
            const user=await newUser.findById(req.user.id).select("fullName");
            const activityMessage=`${user.fullName} edit pdf's name from "${pdf.pdfName}" to "${body.name.trim()}".`;
            createActivity(req.user.id.toString(),activityMessage,projectId,"pdf_related",res);
        }
        return res.json({msg:"success"});
    }catch (err) {
        console.log("UPLOAD ERROR:", err);
        return res.json({msg:"Something went wrong."});
    }
}

async function deletePdf(req,res){
    try{
        const projectId=req.params.projectId;
        const pdfId=req.params.pdfId;
        const pdf=await pdfModel.findById(pdfId);
        if(!pdf){
            return res.json({msg:"pdf is not found"});
        }
        await cloudinary.uploader.destroy(pdf.storageId,{
            resource_type:"image"
        });
        await pdfModel.findByIdAndDelete(pdfId);
        if(pdf.scope==="team"){
            const user=await newUser.findById(req.user.id).select("fullName");
            const activityMessage=`${user.fullName} deleted a pdf named "${pdf.pdfName}".`;
            createActivity(req.user.id.toString(),activityMessage,projectId,"pdf_related",res);
        }
        return res.json({msg:"success"});
    }catch (err) {
        console.log("UPLOAD ERROR:", err);
        return res.json({msg:"Something went wrong."});
    }
}

module.exports={createNote,getNotes,deleteNote,editNote,pdf,getPdf,teamPdf,getPdfName,editPdf,deletePdf};