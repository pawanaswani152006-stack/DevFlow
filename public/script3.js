const newBtn=document.querySelector("#createButton");
const newProjPage=document.querySelector("#newProject");
const newProjPageHolder=document.querySelector("#newProjectHolder");
const cancelBtn=document.querySelector("#newProjectCancelButton");
const form=document.querySelector("#form");
const emptyState=document.querySelectorAll(".gridEmptyState");
const grid=document.querySelector("#grid");
let searchInput=document.querySelector("#navInput");
let activeBtn=document.querySelector("#activeButton");
let completedButton=document.querySelector("#completedButton");
let allButton=document.querySelector("#allButton");
allButton.style.backgroundColor="rgb(15, 56, 56)";
let allProjects=[];
let currentFilter="All";
let searchText=searchInput.value;
const noSearchElements=document.querySelectorAll(".noSearchState");


newBtn.addEventListener("click",()=>{
    newProjPageHolder.style.display="flex";
    document.body.style.overflow = "hidden";
})
function cancelAnimation(){
    newProjPage.style.animation="cancelProject 0.5s ease 0s forwards";
    setTimeout(()=>{
        newProjPageHolder.style.display="none";
        document.body.style.overflow = "auto";
        newProjPage.style.animation="newProject 0.5s ease 0s forwards";
        form.reset();
    },500);
}
cancelBtn.addEventListener("click",cancelAnimation);

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
        textArea:textArea.value,
        status:"Active"
    };
    let res=await fetch("/dashboard/projects",{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await res.json();
    allProjects.push(result.project);
    if(result.success==true){
        cancelAnimation();
        let div=await projectCard(projectName.value,textArea.value,trackingMode.value,date.value,result.project._id);
        setTimeout(()=>{
            emptyState.forEach((state)=>{
                state.style.animation="emptyFade 0.1s linear 0s forwards"; 
                setTimeout(()=>{
                    grid.style.marginTop="10vh";
                    grid.style.display="flex";
                    state.style.display="none";
                    searchInput.disabled=false;
                    allButton.disabled=false;
                    activeButton.disabled=false;
                    completedButton.disabled=false;
                    allButton.style.backgroundColor="rgb(2, 17, 23)";
                    activeButton.style.backgroundColor="rgb(2, 17, 23)";
                    completedButton.style.backgroundColor="rgb(2, 17, 23)";
                },100);  
            });
            setTimeout(()=>{
                div.scrollIntoView({
                    behavior:"smooth",
                    block:"center"
                });
                div.style.animation="cardAnimation 0.1s linear 0.5s forwards";  
            },100);
        },600);
        
    }
})

function dateCreater(customizedDate){
    const newDate=new Date(customizedDate);
    return newDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
async function reload(){
    const data=await fetch("/dashboard/projects",{
        method:"get"
    });
    const projects=await data.json();
    allProjects=projects.arr;
    if(projects.arr.length===0){
        searchInput.disabled=true;
        allButton.disabled=true;
        activeButton.disabled=true;
        completedButton.disabled=true;
        allButton.style.backgroundColor="rgb(100, 103, 104)";
        activeButton.style.backgroundColor="rgb(100, 103, 104)";
        completedButton.style.backgroundColor="rgb(100, 103, 104)";
        grid.style.marginTop="7vh";
        grid.style.display="block";
        emptyState.forEach((state)=>{
            state.style.display="block";
        });
    }else{
        projects.arr.forEach((project)=>{
            let div=projectCard(project.projectName,project.description,project.trackingMode,dateCreater(project.deadline),project._id);
            div.style.animation="cardAnimation 0.5s linear 0s forwards";
        });
    }
}
reload();

function projectCard(projectName,description,trackingMode,deadline,projectId){
    let div=document.createElement("div");
    let cardButton=document.createElement("button");
    div.classList.add("project");
    cardButton.classList.add("projectAnimationHolder");
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
        cardButton.appendChild(div);
        cardButton.dataset.projectId=projectId;
        cardButton.addEventListener("click",()=>{
            console.log("hello");
            location.href=`/dashboard/projects/${cardButton.dataset.projectId}`;
        })
        grid.appendChild(cardButton);
        return div;
}

function renderProjects(){
    let filtered=allProjects;
    if(filtered.length!==0){
       if(currentFilter !== "All"){
            filtered=filtered.filter((project)=>{
                return project.status===currentFilter
            });
        }
        if(searchText.trim()!==""){
            filtered=filtered.filter((project)=>{
                return (project.projectName.toLowerCase()).includes(searchText.toLowerCase())
            });
        } 
    }
    grid.innerHTML="";
    if(filtered.length===0){
        grid.style.marginTop="5vh";
        grid.innerHTML=
            `<h1 class="noSearchState" id="noSearchHeading" style="display:block;"><span style="font-size:3rem;color:none;background-color:transparent;"><i class="fa-solid fa-magnifying-glass-minus"></i></span> No matching projects found</h1>
            <p class="noSearchState" id="noSearchPara2" style="display:block;">Try a different search or change the selected filter.</p>`;
        grid.style.display="block";
        
    }else{
        let div;
        grid.style.marginTop="10vh";
        grid.style.display="flex";
        filtered.forEach((project)=>{
         div=projectCard(project.projectName,project.description,project.trackingMode,dateCreater(project.deadline),project._id);
         div.style.animation="cardAnimation 0.5s linear 0s forwards";
        });
    }
    
}

allButton.addEventListener("click",()=>{
    allButton.style.backgroundColor="rgb(15, 56, 56)";
    activeBtn.style.backgroundColor="rgb(2, 17, 23)";
    completedButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="All";
    renderProjects();
});

completedButton.addEventListener("click",()=>{
    completedButton.style.backgroundColor="rgb(15, 56, 56)";
    activeBtn.style.backgroundColor="rgb(2, 17, 23)";
    allButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="Completed";
    renderProjects();
});

activeBtn.addEventListener("click",()=>{
    activeBtn.style.backgroundColor="rgb(15, 56, 56)";
    allButton.style.backgroundColor="rgb(2, 17, 23)";
    completedButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="Active";
    renderProjects();
});

searchInput.addEventListener("input",()=>{
    searchText=searchInput.value;
    renderProjects();
})