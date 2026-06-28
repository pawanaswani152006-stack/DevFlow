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
