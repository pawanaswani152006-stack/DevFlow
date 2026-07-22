let currUserId=null;
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
const intervalId=setInterval(verifyUser,5000);

const waitingPageComments=document.querySelector("#waitingPageComments");
const emailChangeComments=document.querySelector("#emailChangeComments");

const resendButton=document.querySelector("#resendButton");
resendButton.addEventListener("click",async ()=>{
    if(currUserId===null){
        return;
    }
    const response=await fetch(`/resendEmail/${currUserId}`,{
        method:"get"
    })
    const result=await response.json();
    if(result.msg==="success"){
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

const changeButton=document.querySelector("#changeButton");
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
            },300);
        },3000);
    }
})