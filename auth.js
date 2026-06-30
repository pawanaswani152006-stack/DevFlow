const express=require("express");
const cookieParser=require("cookie-parser");
const app=express();
const router=require("./routers/authRoute.js");
const router1=require("./routers/projectDashboard.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/",router);
app.use("/dashboard",router1);

app.listen(8000,()=>console.log("server started..."));