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
let onHoldButton=document.querySelector("#onHoldButton");
let allButton=document.querySelector("#allButton");
allButton.style.backgroundColor="rgb(15, 56, 56)";
let allProjects=[];
let currentFilter="All";
let searchText=searchInput.value;
const noSearchElements=document.querySelectorAll(".noSearchState");
const welcomePara1=document.querySelector("#welcomePara1");


newBtn.addEventListener("click",()=>{
    newProjPageHolder.style.display="flex";
    document.body.style.overflow = "hidden";
    newProjPage.style.animation="newProject 0.5s ease 0s forwards";
    if(allProjects.length!==0){
        allButton.style.backgroundColor="rgb(15, 56, 56)";
        activeButton.style.backgroundColor="rgb(2, 17, 23)";
        onHoldButton.style.backgroundColor="rgb(2, 17, 23)";
        completedButton.style.backgroundColor="rgb(2, 17, 23)";
        currentFilter="All";
        renderProjects();
    }
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
    const body={
        projectName:projectName.value,
        deadline:date.value,
        textArea:textArea.value
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
    if(result.success===true){
        cancelAnimation();
        let div=await projectCard(result.project.owner.fullName,projectName.value,textArea.value,dateCreater(date.value),result.project._id);
        setTimeout(()=>{
            emptyState.forEach((state)=>{
                state.style.animation="emptyFade 0.1s linear 0s forwards"; 
                setTimeout(()=>{
                    grid.style.marginTop="50px";
                    grid.style.display="flex";
                    state.style.display="none";
                },100);
                searchInput.disabled=false;
                allButton.disabled=false;
                activeButton.disabled=false;
                completedButton.disabled=false;
                onHoldButton.disabled=false;
                allButton.style.backgroundColor="rgb(15, 56, 56)";
                activeButton.style.backgroundColor="rgb(2, 17, 23)";
                onHoldButton.style.backgroundColor="rgb(2, 17, 23)";
                completedButton.style.backgroundColor="rgb(2, 17, 23)";
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
    allProjects=[];
    grid.innerHTML="";
    allProjects.push(...projects.arr);
    if(projects.arr.length===0){
        searchInput.disabled=true;
        allButton.disabled=true;
        activeButton.disabled=true;
        onHoldButton.disabled=true;
        completedButton.disabled=true;
        allButton.style.backgroundColor="rgb(100, 103, 104)";
        activeButton.style.backgroundColor="rgb(100, 103, 104)";
        onHoldButton.style.backgroundColor="rgb(100, 103, 104)";
        completedButton.style.backgroundColor="rgb(100, 103, 104)";
        grid.style.marginTop="30px";
        grid.style.display="block";
        emptyState.forEach((state)=>{
            state.style.display="block";
            grid.appendChild(state);
        });
    }else{
        projects.arr.forEach((project)=>{
            let div=projectCard(project.owner.fullName,project.projectName,project.description,dateCreater(project.deadline),project._id);
            div.style.animation="cardAnimation 0.5s linear 0s forwards";
        });
    }
    const span=document.createElement("span");
    welcomePara1.innerHTML="";
    span.innerHTML=
        `Good Evening, ${projects.dashboardOwner.fullName}`
    welcomePara1.appendChild(span);
}
reload();

function projectCard(owner,projectName,description,deadline,projectId){
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
            <p class="projectPara">Owner: <span class="projectAnsPara">${owner}</span></p>
            <p class="projectPara">Due: <span class="projectAnsPara">${deadline}</span></p>
            <div class="status"><div class="statusRepresenter" style="margin-bottom:15px;"></div><p class="projectPara" style="margin-left:5px;line-height:15px;font-size:1.5rem;color:rgb(2, 56, 49);">Active</p></div>
        </div>`;
    cardButton.appendChild(div);
    cardButton.dataset.projectId=projectId;
    cardButton.addEventListener("click",()=>{
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
        grid.style.marginTop="30px";
        grid.innerHTML=
            `<h1 class="noSearchState" id="noSearchHeading" style="display:block;"><span style="font-size:3rem;color:none;background-color:transparent;"><i class="fa-solid fa-magnifying-glass-minus"></i></span> No matching projects found</h1>
            <p class="noSearchState" id="noSearchPara2" style="display:block;">Try a different search or change the selected filter.</p>`;
        grid.style.display="block";
        
    }else{
        let div;
        grid.style.marginTop="60px";
        grid.style.display="flex";
        filtered.forEach((project)=>{
         div=projectCard(project.owner.fullName,project.projectName,project.description,dateCreater(project.deadline),project._id);
         div.style.animation="cardAnimation 0.5s linear 0s forwards";
        });
    }
    
}

allButton.addEventListener("click",()=>{
    allButton.style.backgroundColor="rgb(15, 56, 56)";
    activeBtn.style.backgroundColor="rgb(2, 17, 23)";
    onHoldButton.style.backgroundColor="rgb(2, 17, 23)";
    completedButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="All";
    renderProjects();
});

completedButton.addEventListener("click",()=>{
    completedButton.style.backgroundColor="rgb(15, 56, 56)";
    activeBtn.style.backgroundColor="rgb(2, 17, 23)";
    onHoldButton.style.backgroundColor="rgb(2, 17, 23)";
    allButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="Completed";
    renderProjects();
});

activeBtn.addEventListener("click",()=>{
    activeBtn.style.backgroundColor="rgb(15, 56, 56)";
    allButton.style.backgroundColor="rgb(2, 17, 23)";
    onHoldButton.style.backgroundColor="rgb(2, 17, 23)";
    completedButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="Active";
    renderProjects();
});

onHoldButton.addEventListener("click",()=>{
    onHoldButton.style.backgroundColor="rgb(15, 56, 56)";
    allButton.style.backgroundColor="rgb(2, 17, 23)";
    activeBtn.style.backgroundColor="rgb(2, 17, 23)";
    completedButton.style.backgroundColor="rgb(2, 17, 23)";
    currentFilter="onHold";
    renderProjects();
});

searchInput.addEventListener("input",()=>{
    searchText=searchInput.value;
    renderProjects();
})

const profileHolder=document.querySelector("#profileHolder");
const profilePage=document.querySelector("#profilePage");
const profileEditPage=document.querySelector("#profileEditPage");
const profileEditPassPage=document.querySelector("#profileEditPassPage");
const profileEditEmailPage=document.querySelector("#profileEditEmailPage");

const profileButton=document.querySelector("#option");
const profilePageEditButton=document.querySelector("#profilePageEditButton");
const profilePageCloseButton=document.querySelector("#profilePageCloseButton");
const profilePageOptionEditPasswordButton=document.querySelector("#profilePageOptionEditPasswordButton");
const profilePageOptionEditEmailButton=document.querySelector("#profilePageOptionEditEmailButton");
const profilePageEditNameButton=document.querySelector("#profilePageEditNameButton");
const profilePageCancelEditNameButton=document.querySelector("#profilePageCancelEditNameButton");
const profilePageChangePasswordButton=document.querySelector("#profilePageChangePasswordButton");
const profilePageChangePasswordCancelButton=document.querySelector("#profilePageChangePasswordCancelButton");
const profilePageSendEmailLinkButton=document.querySelector("#profilePageSendEmailLinkButton");
const profilePageEmailEditCancelButton=document.querySelector("#profilePageEmailEditCancelButton");
const profilePageEditEmailResendButton=document.querySelector("#profilePageEditEmailResendButton");
const profilePageEditAnotherEmailButton=document.querySelector("#profilePageEditAnotherEmailButton");
const profilePageWaitingPageCancelButton=document.querySelector("#profilePageWaitingPageCancelButton");

const profilePageUserNameHolder=document.querySelector("#profilePageUserNameHolder");
const profilePageUserEmailHolder=document.querySelector("#profilePageUserEmailHolder");
const profilePageJoinedAtHolder=document.querySelector("#profilePageJoinedAtHolder");
const profilePageTotalProjectsHolder=document.querySelector("#profilePageTotalProjectsHolder");
const profilePageEditNameInput=document.querySelector("#profilePageEditNameInput");

const profilePageEditPasswordComment=document.querySelector("#profilePageEditPasswordComment");
const profilePageEditEmailComment=document.querySelector("#profilePageEditEmailComment");
const profilePageEditNameComment=document.querySelector("#profilePageEditNameComment");

let currUserName;
profileButton.addEventListener("click",async ()=>{
    const response=await fetch(`/dashboard/projects/getProfile`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        profilePageJoinedAtHolder.innerText=`${dateCreater(result.user.createdAt)}`;
        profilePageUserNameHolder.innerText=`${result.user.fullName}`;
        profilePageUserEmailHolder.innerText=`${result.user.email}`;
        profilePageTotalProjectsHolder.innerText=`${allProjects.length}`;
        currUserName=result.user.fullName;
        profileHolder.style.display="flex";
        profilePage.style.display="block";
        document.body.style.overflow = "hidden";
        profilePage.style.animation="newProject 0.5s ease 0s forwards";
    }
})
profilePageCloseButton.addEventListener("click",()=>{
    profilePage.style.animation="cancelProject 0.5s ease 0s forwards";
    setTimeout(()=>{
        profilePage.style.display="none";
        profileHolder.style.display="none";
        document.body.style.overflow = "auto";
    },500);
})
profilePageEditButton.addEventListener("click",()=>{
    profilePageEditNameInput.value=`${currUserName}`;
    profilePage.style.animation="pageFlip1 0.3s linear 0s forwards";
    setTimeout(()=>{
        profilePage.style.display="none";
        profileEditPage.style.display="block";
        profileEditPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300);
})
profilePageCancelEditNameButton.addEventListener("click",()=>{
    profileEditPage.style.animation="pageFlip1 0.3s linear 0s forwards";
    setTimeout(()=>{
        profilePage.style.display="block";
        profileEditPage.style.display="none";
        profilePage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300);
})
profilePageOptionEditPasswordButton.addEventListener("click",()=>{
    profileEditPage.style.animation="pageFlip1 0.3s linear 0s forwards";
    setTimeout(()=>{
        profileEditPassPage.style.display="block";
        profileEditPage.style.display="none";
        profileEditPassPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300);
})
profilePageOptionEditEmailButton.addEventListener("click",()=>{
    profileEditEmailPageInput.value="";
    profileEditPage.style.animation="pageFlip1 0.3s linear 0s forwards";
    setTimeout(()=>{
        profileEditEmailPage.style.display="block";
        profileEditPage.style.display="none";
        profileEditEmailPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300);
})
profilePageChangePasswordCancelButton.addEventListener("click",()=>{
    profilePageEditNameInput.value=`${currUserName}`;
    profileEditPassPage.style.animation="pageFlip1 0.3s linear 0s forwards";
    setTimeout(()=>{
        profileEditPage.style.display="block";
        profileEditPassPage.style.display="none";
        profileEditPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300);
})
profilePageEmailEditCancelButton.addEventListener("click",()=>{
    profilePageEditNameInput.value=`${currUserName}`;
    profileEditEmailPage.style.animation="pageFlip1 0.3s linear 0s forwards";
    setTimeout(()=>{
        profileEditPage.style.display="block";
        profileEditEmailPage.style.display="none";
        profileEditPage.style.animation="pageFlip2 0.3s linear 0s forwards";
    },300);
})

const profilePageNameEditForm=document.querySelector("#profilePageNameEditForm");

profilePageNameEditForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    body={
        newName:profilePageEditNameInput.value
    }
    const response=await fetch(`/dashboard/projects/editName`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        profilePageEditNameComment.innerText="Name Changed Successfully";
        profilePageEditNameComment.style.display="flex";
        profilePageEditNameComment.style.animation="commentFadeIn 0.3s linear 0s forwards";
        setTimeout(()=>{
            profilePageEditNameComment.style.animation="commentFadeOut 0.3s linear 0s forwards";
            setTimeout(()=>{
                profilePageEditNameComment.style.display="none";
            },300)
            profilePageUserNameHolder.innerText=`${result.fullName}`;
            currUserName=result.fullName;
            reload();
        },1300);
        
    }
})

const profilePageEditPasswordForm=document.querySelector("#profilePageEditPasswordForm");
const profilePageNewPasswordInput=document.querySelector("#profilePageNewPasswordInput");
const profilePageConfirmPasswordInput=document.querySelector("#profilePageConfirmPasswordInput");

profilePageEditPasswordForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const newPass=profilePageNewPasswordInput.value;
    const confirmPass=profilePageConfirmPasswordInput.value;
    if(!newPass || !confirmPass){
        return;
    }
    if(newPass.length<8){
        return;
    }
    if(newPass!==confirmPass){
        return;
    }
    const body={
        newPass:newPass,
        confirmPass:confirmPass
    }
    const response=await fetch(`/dashboard/projects/setNewPassword`,{
        method:"PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        profilePageEditPasswordComment.innerText="Password Changed Successfully";
        profilePageEditPasswordComment.style.display="flex";
        profilePageEditPasswordComment.style.animation="commentFadeIn 0.3s linear 0s forwards";
        setTimeout(()=>{
            profilePageEditPasswordComment.style.animation="commentFadeOut 0.3s linear 0s forwards";
            setTimeout(()=>{
                profilePageEditPasswordComment.style.display="none";
            },300)
            profilePageNewPasswordInput.value="";
            profilePageConfirmPasswordInput.value="";
            profilePageEditNameInput.value=`${currUserName}`;
            profileEditPassPage.style.animation="pageFlip1 0.3s linear 0s forwards";
            setTimeout(()=>{
                profileEditPage.style.display="block";
                profileEditPassPage.style.display="none";
                profileEditPage.style.animation="pageFlip2 0.3s linear 0s forwards";
            },300);
        },1300);
        
    }
})

const profileEditEmailPageForm=document.querySelector("#profileEditEmailPageForm");
const profileEditEmailPageInput=document.querySelector("#profileEditEmailPageInput");
const profileEditEmailPageElement1=document.querySelector("#profileEditEmailPageElement1");
const profileEditEmailPageElement2=document.querySelector("#profileEditEmailPageElement2");
let checkForNewEmail;
let newEmail=null;
profileEditEmailPageForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    newEmail=profileEditEmailPageInput.value;
    const body={
        newEmail:profileEditEmailPageInput.value
    }
    const response=await fetch(`/dashboard/projects/sendNewEmailChangeLink`,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        clock=setInterval(resendCountDownFunction,1000);
        checkForNewEmail=setInterval(checkForNewEmailVerification,5000);
        profileEditEmailPageElement1.style.animation="fadeOut 0.3s linear 0s forwards";
        setTimeout(()=>{
            profileEditEmailPageElement1.style.display="none";
            profileEditEmailPageElement2.style.display="block";
            profileEditEmailPageElement2.style.animation="fadeIn 0.3s linear 0s forwards";
        },300);
    }
})

async function checkForNewEmailVerification(){
    const response=await fetch(`/dashboard/projects/checkForNewEmailVerification`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        profilePageEditEmailComment.innerText="Email Changed Successfully";
        profilePageEditEmailComment.style.display="flex";
        profilePageEditEmailComment.style.animation="commentFadeIn 0.3s linear 0s forwards";
        setTimeout(()=>{
            profilePageEditEmailComment.style.animation="commentFadeOut 0.3s linear 0s forwards";
            setTimeout(()=>{
                profilePageEditEmailComment.style.display="none";
            },300)
            profileEditEmailPageInput.value="";
            profilePageUserEmailHolder.innerText=`${result.email}`;
            profilePageEditNameInput.value=`${currUserName}`;
            profileEditEmailPage.style.animation="pageFlip1 0.3s linear 0s forwards";
            setTimeout(()=>{
                profileEditPage.style.display="block";
                profileEditEmailPage.style.display="none";
                profileEditPage.style.animation="pageFlip2 0.3s linear 0s forwards";
                profileEditEmailPageElement1.style.display="block";
                profileEditEmailPageElement1.style.opacity=1;
                profileEditEmailPageElement1.style.transform="translateY(0px)";
                profileEditEmailPageElement1.style.animation="";
                profileEditEmailPageElement2.style.animation="";
                profileEditEmailPageElement2.style.opacity=0;
                profileEditEmailPageElement2.style.transform="translateY(40px)";
                profileEditEmailPageElement2.style.display="none";
            },300);
        },1300);
        
    }
    if(result.msg==="link expired"){
        clearInterval(checkForNewEmail);
    }
}

profilePageEditAnotherEmailButton.addEventListener("click",async ()=>{
    const response=await fetch(`/dashboard/projects/cancelNewEmailSetProcess`,{
        method:"delete"
    });
    const result=await response.json();
    if(result.msg==="success"){
        profileEditEmailPageInput.value="";
        profileEditEmailPageElement2.style.animation="fadeOut 0.3s linear 0s forwards";
        setTimeout(()=>{
            profileEditEmailPageElement2.style.display="none";
            profileEditEmailPageElement1.style.display="block";
            profileEditEmailPageElement1.style.animation="fadeIn 0.3s linear 0s forwards";
        },300);
    }
})

profilePageWaitingPageCancelButton.addEventListener("click",async ()=>{
    const response=await fetch(`/dashboard/projects/cancelNewEmailSetProcess`,{
        method:"delete"
    });
    const result=await response.json();
    if(result.msg==="success"){
        profileEditEmailPageInput.value="";
        profilePageEditNameInput.value=`${currUserName}`;
        profileEditEmailPage.style.animation="pageFlip1 0.3s linear 0s forwards";
        setTimeout(()=>{
            profileEditPage.style.display="block";
            profileEditEmailPage.style.display="none";
            profileEditPage.style.animation="pageFlip2 0.3s linear 0s forwards";
            profileEditEmailPageElement1.style.display="block";
            profileEditEmailPageElement1.style.opacity=1;
            profileEditEmailPageElement1.style.transform="translateY(0px)";
            profileEditEmailPageElement1.style.animation="";
            profileEditEmailPageElement2.style.animation="";
            profileEditEmailPageElement2.style.opacity=0;
            profileEditEmailPageElement2.style.transform="translateY(40px)";
            profileEditEmailPageElement2.style.display="none";
        },300);
    }
})

profilePageEditEmailResendButton.addEventListener("click",async ()=>{
    if(newEmail===null){
        return;
    }
    const body={
        newEmail:newEmail
    }
    const response=await fetch(`/dashboard/projects/resendSetNewEmailLink`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        clock=setInterval(resendCountDownFunction,1000);
        checkForNewEmail=setInterval(checkForNewEmailVerification,5000);
        profilePageEditEmailComment.innerText="Link Sent Successfully";
        profilePageEditEmailComment.style.display="flex";
        profilePageEditEmailComment.style.animation="commentFadeIn 0.3s linear 0s forwards";
        setTimeout(()=>{
            profilePageEditEmailComment.style.animation="commentFadeOut 0.3s linear 0s forwards";
            setTimeout(()=>{
                profilePageEditEmailComment.style.display="none";
            },300)
        },1300);
    }
})

const countdown=document.querySelector("#countdown");
const timer=document.querySelector("#timer");
let clock;

async function resendCountDownFunction(){
    const response=await fetch(`/dashboard/projects/resendAvailableTime`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        profilePageEditEmailResendButton.style.backgroundColor="rgb(87, 94, 96)";
        profilePageEditEmailResendButton.disabled=true;
        countdown.style.display="block";
        timer.innerText=`${result.remainingSeconds}`;
    }
    if(result.msg==="timeout"){
        clearInterval(clock);
        profilePageEditEmailResendButton.style.backgroundColor="rgb(3, 45, 62)";
        profilePageEditEmailResendButton.disabled=false;
        countdown.style.display="none";
    }
    if(result.msg==="not available"){
        clearInterval(clock);
        profilePageEditEmailResendButton.style.backgroundColor="rgb(3, 45, 62)";
        profilePageEditEmailResendButton.disabled=false;
        countdown.style.display="none";
    }
}

const logoutButton=document.querySelector("#logoutButton");
const profilePageComment=document.querySelector("#profilePageComment");

logoutButton.addEventListener("click",async ()=>{
    const response=await fetch(`/dashboard/projects/logOut`,{
        method:"delete"
    });
    const result=await response.json();
    if(result.msg==="success"){
        profilePageComment.innerText="Logout Successfully";
        profilePageComment.style.display="flex";
        profilePageComment.style.animation="commentFadeIn 0.3s linear 0s forwards";
        setTimeout(()=>{
            profilePageComment.style.animation="commentFadeOut 0.3s linear 0s forwards";
            setTimeout(()=>{
                profilePageComment.style.display="none";
                location.replace("/signIn.html?mode=signIn");
            },300)
        },1300);
    }
})