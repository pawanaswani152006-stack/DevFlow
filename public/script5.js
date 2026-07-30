let currUserId=null;
const countdown=document.querySelector("#countdown");
const timer=document.querySelector("#timer");
let clock;
let intervalId;
const resendButton=document.querySelector("#resendButton");
const changeButton=document.querySelector("#changeButton");

async function countdownFunction(){
    if(currUserId===null){
        return;
    }
    let response=await fetch(`/resendTime/${currUserId}`,{
        method:"get"
    });
    let result=await response.json();
    if(result.msg==="success"){
        resendButton.disabled=true;
        changeButton.disabled=true;
        resendButton.style.backgroundColor="rgb(79, 88, 91)";
        changeButton.style.backgroundColor="rgb(79, 88, 91)";
        countdown.style.display="block";
        timer.innerText=result.remainingSeconds;
    }
    if(result.msg==="timeout"){
        resendButton.disabled=false;
        changeButton.disabled=false;
        resendButton.style.backgroundColor="rgb(7, 32, 44)";
        changeButton.style.backgroundColor="rgb(7, 32, 44)";
        clearInterval(clock);
        countdown.style.display="none";
    }
}
clock=setInterval(countdownFunction,1000);

async function verifyUser(){
    const response=await fetch("/verify",{
        method:"get"
    });
    const user=await response.json();
    if(user.expire===true){
        clearInterval(intervalId);
        return;
    }
    currUserId=user.userId;
    if(user.isVarified.isVarified){
        clearInterval(intervalId);
        const result=await fetch(`/userVarified/${user.isVarified._id.toString()}`,{
            method:"get"
        });
        const message=await result.json();
        if(message.msg==="success"){
            window.location.replace("/dashboard");
        }
    }
}
intervalId=setInterval(verifyUser,5000);
verifyUser();

const waitingPageComments=document.querySelector("#waitingPageComments");
const emailChangeComments=document.querySelector("#emailChangeComments");
resendButton.addEventListener("click",async ()=>{
    if(currUserId===null){
        return;
    }
    const response=await fetch(`/resendEmail/${currUserId}`,{
        method:"get"
    })
    const result=await response.json();
    if(result.msg==="success"){
        clock=setInterval(countdownFunction,1000);
        intervalId=setInterval(verifyUser,5000);
        waitingPageComments.style.display="flex";
        waitingPageComments.style.animation="commentShow 0.5s linear 0s forwards";
        setTimeout(()=>{
            waitingPageComments.style.animation="commentHide 0.5s linear 0s forwards";
            setTimeout(()=>{
                waitingPageComments.style.display="none";
            },500);
        },1000);
    }
})

const emailInput=document.querySelector("#emailInput");
const changeEmailDataHolder=document.querySelector("#changeEmailDataHolder");
const waitingPageDataHolder=document.querySelector("#waitingPageDataHolder");

changeButton.addEventListener("click",async ()=>{
    if(currUserId===null){
        return;
    }
    waitingPageDataHolder.style.animation="cancelAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        waitingPageDataHolder.style.display="none";
        changeEmailDataHolder.style.display="block";
        changeEmailDataHolder.style.animation="pageflip 0.3s linear 0s forwards";
    },300);
    const response=await fetch(`/getEmail/${currUserId}`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        emailInput.value=result.email;
    }
})

const emailChangeCancelButton=document.querySelector("#emailChangeCancelButton");

emailChangeCancelButton.addEventListener("click",()=>{
    changeEmailDataHolder.style.animation="cancelAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        changeEmailDataHolder.style.display="none";
        waitingPageDataHolder.style.display="block";
        waitingPageDataHolder.style.animation="pageflip 0.3s linear 0s forwards";
    },300);
})

const emailChangeForm=document.querySelector("#emailChangeForm");
const emailChangeButton=document.querySelector("#emailChangeButton");
emailChangeForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email=emailInput.value;
    const body={
        email:email
    }
    const response=await fetch(`/changeEmail/${currUserId}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        emailChangeCancelButton.disabled=true;
        emailChangeCancelButton.style.backgroundColor="rgb(79, 88, 91)";
        emailChangeButton.disabled=true;
        emailChangeButton.style.backgroundColor="rgb(79, 88, 91)";
        clock=setInterval(countdownFunction,1000);
        intervalId=setInterval(verifyUser,5000);
        emailChangeComments.style.display="flex";
        emailChangeComments.style.animation="commentShow 0.5s linear 0s forwards";
        setTimeout(()=>{
            emailChangeComments.style.animation="commentHide 0.5s linear 0s forwards";
            setTimeout(()=>{
                emailChangeComments.style.display="none";
            },500);
        },2000);
        setTimeout(()=>{
            changeEmailDataHolder.style.animation="cancelAnimation 0.3s linear 0s forwards";
            setTimeout(()=>{
                changeEmailDataHolder.style.display="none";
                waitingPageDataHolder.style.display="block";
                waitingPageDataHolder.style.animation="pageflip 0.3s linear 0s forwards";
                emailChangeCancelButton.disabled=false;
                emailChangeCancelButton.style.backgroundColor="rgb(7, 32, 44)";
                emailChangeButton.disabled=false;
                emailChangeButton.style.backgroundColor="rgb(7, 32, 44)";
            },300);
        },3000);
    }
})