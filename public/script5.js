async function verifyUser(){
    const response=await fetch("/verify",{
        method:"get"
    });
    const user=await response.json();
    if(user.expire===true){
        clearInterval(intervalId);
        return;
    }
    if(user.isVarified.isVarified){
        clearInterval(intervalId);
        const result=await fetch(`/userVarified/${user.isVarified._id.toString()}`,{
            method:"get"
        });
        const message=await result.json();
        if(message.msg==="success"){
            location.href="/dashboard";
        }
    }
}
const intervalId=setInterval(verifyUser,5000);