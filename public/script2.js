const params=new URLSearchParams(window.location.search);
const mode=params.get("mode");

let create=document.querySelector("#createBtn1");
let signIn=document.querySelector("#signBtn2");
let signInPage=document.querySelector("#formElementsContainer")
let signUpPage=document.querySelector("#formElementContainer2");
let page1=document.querySelector("#form1");
let page2=document.querySelector("#form2");

if(mode==="signUp"){
    signInPage.style.display="none";
    page1.style.display="none";
    signUpPage.style.display="block";
    page2.style.display="flex";
}

create.addEventListener("click",(e)=>{
    e.preventDefault();
    signInPage.style.animation="pageFlip 0.3s ease 0s forwards";
    setTimeout(()=>{
        signInPage.style.display="none";
        page1.style.display="none";
    },300);
    setTimeout(()=>{
        signUpPage.style.display="block";
        page2.style.display="flex";
        signUpPage.style.animation="pageFlip2 0.3s ease 0s forwards";
    },400);
});

signIn.addEventListener("click",(e)=>{
    e.preventDefault();
    signUpPage.style.animation="pageFlip 0.3s ease 0s forwards";
    setTimeout(()=>{
        signUpPage.style.display="none";
        page2.style.display="none";
    },300);
    setTimeout(()=>{
        signInPage.style.display="block";
        page1.style.display="flex";
        signInPage.style.animation="pageFlip2 0.3s ease 0s forwards";
    },400);
});

let msgBox=document.querySelector("#message");
let msgPara=document.querySelector("#msgPara");
let form1=document.querySelector("#form01");
form1.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let Email=document.querySelector("#email");
    let Password=document.querySelector("#password");
    let bodySignIn={
        email:Email.value,
        password:Password.value
    }

    let msg=null;
    if(!bodySignIn.email && !bodySignIn.password){
        msg="Please fulfil the requirements";
    }else if(!bodySignIn.password){
        msg="Please enter the password";
    }else if(!bodySignIn.email){
        msg="Please enter the email";
    }else if(bodySignIn.password.length<8){
        msg="Password must be 8 charcters long";
    }
    if(msg!==null){
        msgBox.style.display="flex";
        msgPara.innerText=msg;
        msgBox.style.transform="translateX(440px)";
        msgBox.style.animation="messageSlide 0.6s ease 0s forwards";
        setTimeout(()=>{
            msgBox.style.transform="translateX(0px)";
            msgBox.style.animation="messageDim 0.2s ease 0s infinite";
        },600);
        setTimeout(()=>{
            msgBox.style.animation="messageFade 0.5s ease 0s forwards";
        },1800);
        return;
    }
    
    let res=await fetch("/signIn",{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(bodySignIn)
    });
    
    let result=await res.json();
    if(result.isSuccess){
        location.href="/dashboard";
    }
    if(result.msg1 || result.msg2){
        msg="Invalid email or password";
    }else if(result.success==false && result.message){
        msg=result.message;
    }
    if(msg!==null){
        msgBox.style.display="flex";
        msgPara.innerText=msg;
        msgBox.style.transform="translateX(440px)";
        msgBox.style.animation="messageSlide 0.6s ease 0s forwards";
        setTimeout(()=>{
            msgBox.style.transform="translateX(0px)";
            msgBox.style.animation="messageDim 0.2s ease 0s infinite";
        },600);
        setTimeout(()=>{
            msgBox.style.animation="messageFade 0.5s ease 0s forwards";
        },1800);
    }
    
});



let form2=document.querySelector("#form02");
form2.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let fullName=document.querySelector("#fullNameSignUp")
    let Email=document.querySelector("#emailSignUp");
    let Password=document.querySelector("#passwordSignUp");
    let reEnteredPassword=document.querySelector("#reEnteredPassword");
    let bodySignUp={
        fullName:fullName.value,
        email:Email.value,
        password:Password.value,
        reEnteredPassword:reEnteredPassword.value
    }
 
    let res=await fetch("/signUp",{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(bodySignUp)
    });

    let msg=null;
    let result=await res.json();
    if(result.isSuccess){
        location.href="waiting.html"
    }
    if(result.alreadyMsg){
        msg=result.alreadyMsg;
    }else if(result.success==false && result.message){
        msg=result.message;
    }else if(result.reMsg){
        msg=result.reMsg;
    }else if(result.passMsg){
        msg=result.passMsg;
    }
    if(msg!==null){
        msgBox.style.display="flex";
        msgPara.innerText=msg;
        msgBox.style.transform="translateX(440px)";
        msgBox.style.animation="messageSlide 0.6s ease 0s forwards";
        setTimeout(()=>{
            msgBox.style.transform="translateX(0px)";
            msgBox.style.animation="messageDim 0.2s ease 0s infinite";
        },600);
        setTimeout(()=>{
            msgBox.style.animation="messageFade 0.5s ease 0s forwards";
        },1800);
    }
    
});

const forgotBtn=document.querySelector("#forgotBtn");
const forgotPassPage=document.querySelector("#forgotPassDataHolder");
const forgotPassForm=document.querySelector("#forgotPassForm");
const forgotEmailInput=document.querySelector("#forgotEmailInput");
const form3=document.querySelector("#form3");

const forgotPage1=document.querySelector("#forgotPage1");
const forgotPage2=document.querySelector("#forgotPage2");
const forgotPage3=document.querySelector("#forgotPage3");

forgotBtn.addEventListener("click",()=>{
    signInPage.style.animation="pageFlip 0.3s linear 0s forwards";
    setTimeout(()=>{
        form1.style.display="none";
        form3.style.display="flex";
        forgotPassPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300)
})

const forgotPageCancelButton=document.querySelector("#forgotPageCancelButton");

forgotPageCancelButton.addEventListener("click",()=>{
    forgotPassPage.style.animation="pageFlip 0.3s linear 0s forwards";
    setTimeout(()=>{
        form3.style.display="none";
        form1.style.display="flex";
        signInPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300)
})
let currentUserId=null;
forgotPassForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email=forgotEmailInput.value;
    const body={
        email:email
    };
    const response=await fetch(`/resetPass`,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        currentUserId=result.id;
        forgotPage1.style.animation="fadeOut 0.3s linear 0s forwards";
        setTimeout(()=>{
            forgotPage1.style.display="none";
            forgotPage2.style.display="block";
            forgotPage3.style.display="none";
            forgotPage2.style.animation="fadeIn 0.3s linear 0s forwards";
        },400);
        checkForPass=setInterval(checkingForResetPassVerification,1000);
    }
})

let checkForPass;
async function checkingForResetPassVerification(){
    const response=await fetch(`/checkForResetPass`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        forgotPage2.style.animation="fadeOut 0.3s linear 0s forwards";
        setTimeout(()=>{
            forgotPage2.style.display="none";
            forgotPage3.style.display="block";
            forgotPage1.style.display="none";
            forgotPage3.style.animation="fadeIn 0.3s linear 0s forwards";
        })
        clearInterval(checkForPass);
        return;
    }
    if(result.msg==="link expired"){
        clearInterval(checkForPass);
    }
}

const forgotPageBackToSignInButton=document.querySelector("#forgotPageBackToSignInButton");
const forgotPageUseAnotherEmailButton=document.querySelector("#forgotPageUseAnotherEmailButton");
const forgotPageNewPassCancelButton=document.querySelector("#forgotPageNewPassCancelButton");

forgotPageBackToSignInButton.addEventListener("click",async ()=>{
    const response=await fetch(`/cancelResetPassProcess`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        forgotPassPage.style.animation="pageFlip 0.3s linear 0s forwards";
        setTimeout(()=>{
            form3.style.display="none";
            form1.style.display="flex";
            signInPage.style.animation="pageFlip2 0.3s linear 0s forwards";
            forgotPage2.style.display="none";
            forgotPage1.style.display="block";
            forgotPage1.style.animation="";
            forgotPage2.style.animation="";
            forgotPage3.style.animation="";
            forgotPage1.style.opacity=1;
            forgotPage2.style.opacity=0;
            forgotPage1.style.transform="translateY(0px)";
            forgotPage2.style.transform="translateY(40px)";
            forgotEmailInput.value="";
        },300);
    }
})

forgotPageNewPassCancelButton.addEventListener("click",async ()=>{
    const response=await fetch(`/cancelResetPassProcess`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        forgotPassPage.style.animation="pageFlip 0.3s linear 0s forwards";
        setTimeout(()=>{
            form3.style.display="none";
            form1.style.display="flex";
            signInPage.style.animation="pageFlip2 0.3s linear 0s forwards";
            forgotPage3.style.display="none";
            forgotPage1.style.display="block";
            forgotPage1.style.animation="";
            forgotPage3.style.animation="";
            forgotPage2.style.animation="";
            forgotPage1.style.opacity=1;
            forgotPage3.style.opacity=0;
            forgotPage1.style.transform="translateY(0px)";
            forgotPage3.style.transform="translateY(40px)";
            forgotEmailInput.value="";
        },300);
    }
})

forgotPageUseAnotherEmailButton.addEventListener("click",async ()=>{
    const response=await fetch(`/cancelResetPassProcess`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        forgotEmailInput.value="";
        forgotPage2.style.animation="fadeOut 0.3s linear 0s forwards";
        setTimeout(()=>{
            forgotPage2.style.display="none";
            forgotPage1.style.display="block";
            forgotPage1.style.animation="fadeIn 0.3s linear 0s forwards";
        },300);
    }
})

const forgotPageResetPassChangeButton=document.querySelector("#forgotPageResetPassChangeButton");
const passwordResetForm=document.querySelector("#passwordResetForm");
const newPasswordInput=document.querySelector("#newPasswordInput");
const newPasswordConfirmInput=document.querySelector("#newPasswordConfirmInput");

passwordResetForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    if(currentUserId!==null){
        console.log("hello bro");
        const newPass=newPasswordInput.value;
        const confirmPass=newPasswordConfirmInput.value;
        console.log(newPass);
        console.log(confirmPass);
        if(!newPass || !confirmPass){
            console.log("yha");
            return;
        }
        if(newPass.length<8){
            console.log("nhi yha");
            return;
        }
        if(newPass!==confirmPass){
            console.log("nhi nhi yha per");
            return;
        }
        const body={
            newPass:newPass,
            confirmPass:confirmPass,
            id:currentUserId
        }
        console.log("yo");
        const response=await fetch(`/setNewPassword`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        });
        const result=await response.json();
        console.log(result);
        if(result.msg==="success"){
            forgotPassPage.style.animation="pageFlip 0.3s linear 0s forwards";
            setTimeout(()=>{
                form3.style.display="none";
                form1.style.display="flex";
                signInPage.style.animation="pageFlip2 0.3s linear 0s forwards";
                forgotPage3.style.display="none";
                forgotPage1.style.display="block";
                forgotPage1.style.animation="";
                forgotPage3.style.animation="";
                forgotPage2.style.animation="";
                forgotPage1.style.opacity=1;
                forgotPage3.style.opacity=0;
                forgotPage1.style.transform="translateY(0px)";
                forgotPage3.style.transform="translateY(40px)";
                forgotEmailInput.value="";
            },300);
        }
    }
})

const forgotPageResendButton=document.querySelector("#forgotPageResendButton");
forgotPageResendButton.addEventListener("click",async ()=>{
    const response=await fetch(`/resendResetPassLink/${currentUserId}`,{
        method:"get"
    });
    const result=await response.json();
})