const params=new URLSearchParams(window.location.search);
const mode=params.get("mode");

let create=document.querySelector("#createBtn1");
let signIn=document.querySelector("#signBtn2");
let signInPage=document.querySelector("#formElementsContainer")
let signUpPage=document.querySelector("#formElementContainer2");

if(mode==="signUp"){
    signInPage.style.display="none";
    signUpPage.style.display="block";
}

create.addEventListener("click",(e)=>{
    e.preventDefault();
    signInPage.style.animation="pageFlip 0.3s ease 0s forwards";
    setTimeout(()=>{
        signInPage.style.display="none";
    },300);
    setTimeout(()=>{
        signUpPage.style.display="block";
        signUpPage.style.animation="pageFlip2 0.3s ease 0s forwards";
    },400);
});

signIn.addEventListener("click",(e)=>{
    e.preventDefault();
    signUpPage.style.animation="pageFlip 0.3s ease 0s forwards";
    setTimeout(()=>{
        signUpPage.style.display="none";
    },300);
    setTimeout(()=>{
        signInPage.style.display="block";
        signInPage.style.animation="pageFlip2 0.3s ease 0s forwards";
    },400);
});
