const http=require("http");
const {Server}=require("socket.io");
const express=require("express");
const cookieParser=require("cookie-parser");
const app=express();
const router=require("./routers/authRoute.js");
const router1=require("./routers/projectDashboard.js");

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
        socket.join(roomId);
        console.log("joined:",roomId);
    });
    socket.on("leaveRoom",(roomId)=>{
        console.log("leave:",roomId);
        socket.leave(roomId);
    });
    socket.on("sendMessage",(data)=>{
        console.log(data);
        io.to(data.roomId).emit("receiveMessage",data);
    });
})

server.listen(8000,()=>console.log("server started..."));