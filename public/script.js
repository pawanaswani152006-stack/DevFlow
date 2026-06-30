const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach((element) => {
  observer.observe(element);
});

let featureBtn=document.querySelector("#featureBtn");
let featureSection=document.querySelector("#featuresSection");
featureBtn.addEventListener("click",()=>{
    featureSection.scrollIntoView({
        behavior: "smooth"
    });
});

let howBtn=document.querySelector("#howBtn");
let workSection=document.querySelector("#workSection");
howBtn.addEventListener("click",()=>{
    workSection.scrollIntoView({
        behavior: "smooth"
    });
});

let aboutBtn=document.querySelector("#aboutBtn");
let footer=document.querySelector("#footer");
aboutBtn.addEventListener("click",()=>{
    footer.scrollIntoView({
        behavior: "smooth"
    });
});

let learnBtn=document.querySelector("#heroButton2");
let problemSection=document.querySelector("#problemSection");
learnBtn.addEventListener("click",()=>{
    problemSection.scrollIntoView({
        behavior: "smooth"
    });
});

let signIn=document.querySelector("#signBtn11");
signIn.addEventListener("click",()=>{
    location.href="signIn.html?mode=signIn";
});

let start=document.querySelector("#startBtn");
start.addEventListener("click",()=>{
    location.href="signIn.html?mode=signUp";
});

let start2=document.querySelector("#heroButton1");
start2.addEventListener("click",()=>{
    location.href="signIn.html?mode=signUp";
});

let start3=document.querySelector("#workingButton");
start3.addEventListener("click",()=>{
    location.href="signIn.html?mode=signUp";
});

let start4=document.querySelector("#ctaButton1");
start4.addEventListener("click",()=>{
    location.href="signIn.html?mode=signUp";
});

let signIn2=document.querySelector("#ctaButton2");
signIn2.addEventListener("click",()=>{
    location.href="signIn.html?mode=signIn";
});
