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
})