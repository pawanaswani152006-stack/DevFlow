require("dotenv").config();
const http=require("http");
const {Server}=require("socket.io");
const express=require("express");
const cookieParser=require("cookie-parser");
const app=express();
const router=require("./routers/authRoute.js");
const router1=require("./routers/projectDashboard.js");
const {saveMessageInfo}=require("./controllers/chatControl.js");

const server=http.createServer(app);
const io=new Server(server);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/",router);
app.use("/dashboard/projects",router1);

io.on("connection",(socket)=>{
    socket.on("joinRoom",(roomId)=>{
        try{
           socket.join(roomId); 
        }catch(err){
            console.log("Error:",err);
            socket.emit("messageError",{
                message:"there is problem"
            });
        }
        
    });
    socket.on("leaveRoom",(roomId)=>{
        try{
           socket.leave(roomId);
        }catch(err){
            console.log("Error:",err);
            socket.emit("messageError",{
                message:"there is problem"
            });
        }
    });
    socket.on("sendMessage",async (body)=>{
        try{
            const createdMsg=await saveMessageInfo(body);
            io.to(body.roomId).emit("receiveMessage",createdMsg);
        }catch(err){
            console.log("Error:",err);
            socket.emit("messageError",{
                message:"there is problem"
            });
        }
    });
})

server.listen(8000,()=>console.log("server started..."));