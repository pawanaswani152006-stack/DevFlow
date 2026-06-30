const newBtn=document.querySelector("#createButton");
const newProjPage=document.querySelector("#newProject");
const newProjPageHolder=document.querySelector("#newProjectHolder");
const cancelBtn=document.querySelector("#newProjectCancelButton");
const form=document.querySelector("#form");

newBtn.addEventListener("click",()=>{
    newProjPageHolder.style.display="flex";
    document.body.style.overflow = "hidden";
})
cancelBtn.addEventListener("click",()=>{
    newProjPage.style.animation="cancelProject 0.5s ease 0s forwards";
    setTimeout(()=>{
        newProjPageHolder.style.display="none";
        document.body.style.overflow = "auto";
        newProjPage.style.animation="newProject 0.5s ease 0s forwards";
        form.reset();
    },500);
})

const projectName=document.querySelector("#projectName");
const date=document.querySelector("#date");
const textArea=document.querySelector("#textArea");
form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const trackingMode=document.querySelector('input[name="Mode"]:checked');
    const body={
        projectName:projectName.value,
        deadline:date.value,
        trackingMode:trackingMode.value,
        textArea:textArea.value
    };
    let res=await fetch("/dashboard",{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await res.json();
    if(result.success==true){
        await projectCard(projectName,textArea,trackingMode,deadline);
    }
})

const grid=document.querySelector("#grid");
function projectCard(projectName,description,trackingMode,deadline){
    let div=document.createElement("div");
    div.classList.add("project");
    div.innerHTML=
        `<div class="projectImage"><i>DF</i></div>
        <div class="projectData">
            <div class="projectNameContainer">
                <p class="projectName">${projectName}</p>
            </div>
            <p class="projectPara">Description: <span class="projectAnsPara">${description}</span></p>
            <p class="projectPara">Owener: <span class="projectAnsPara">Pawan and Chat Gpt</span></p>
            <p class="projectPara">Tracking Mode: <span class="projectAnsPara">${trackingMode}</span></p>
            <p class="projectPara">Due: <span class="projectAnsPara">${deadline}</span></p>
            <div class="status"><div class="statusRepresenter"></div><p class="projectPara" style="margin-left:5px;line-height:15px;font-size:1.5rem;color:rgb(2, 56, 49);">Active</p></div>
        </div>`;
    grid.appendChild(div);
}