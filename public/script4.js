const workHeading=document.querySelector("#workHeading");
const overview=document.querySelector("#overview");
const tasks=document.querySelector("#tasks");
const activity=document.querySelector("#activity");
const discussion=document.querySelector("#discussion");
const notes=document.querySelector("#notes");

const overviewArea=document.querySelector("#work");
const taskArea=document.querySelector("#taskArea");
const activityArea=document.querySelector("#activityArea");
const discussionArea=document.querySelector("#discussionArea");
const notesArea=document.querySelector("#notesArea");

const inviteCardButton=document.querySelector("#inviteCardButton");
const invitePageHolder=document.querySelector("#invitePageHolder");
const cancelBtn=document.querySelector("#cancelBtn");
const invitePage=document.querySelector("#invitePage");

const inviteForm=document.querySelector("#inviteForm");
const emailInput=document.querySelector("#emailInput");
const spacialityInput=document.querySelector("#spacialityInput");
const teamList=document.querySelector("#teamList");

const manageTeamButton=document.querySelector("#manageTeamButton");
const manageFormDataHolder=document.querySelector("#manageFormDataHolder");
const manageFormPlaceHolder=document.querySelector("#manageFormPlaceHolder");
const manageFormContainer=document.querySelector("#manageFormContainer");
const manageFormCancelButton=document.querySelector("#manageFormCancelButton");

function pageFlipAnimation(curr,currBtn){
    overviewArea.style.animation="page1Flip 0.3s linear 0s forwards";
    taskArea.style.animation="page1Flip 0.3s linear 0s forwards";
    activityArea.style.animation="page1Flip 0.3s linear 0s forwards";
    discussionArea.style.animation="page1Flip 0.3s linear 0s forwards";
    notesArea.style.animation="page1Flip 0.3s linear 0s forwards";

    overview.style.backgroundColor="transparent";
    tasks.style.backgroundColor="transparent";
    activity.style.backgroundColor="transparent";
    discussion.style.backgroundColor="transparent";
    notes.style.backgroundColor="transparent";

    currBtn.style.backgroundColor="rgb(49, 82, 74)";

    setTimeout(()=>{
        overviewArea.style.display="none";
        taskArea.style.display="none";
        activityArea.style.display="none";
        discussionArea.style.display="none";
        notesArea.style.display="none";

        overviewArea.style.transform="rotateY(90deg)";
        taskArea.style.transform="rotateY(90deg)";
        activityArea.style.transform="rotateY(90deg)";
        discussionArea.style.transform="rotateY(90deg)";
        notesArea.style.transform="rotateY(90deg)";

        curr.style.display="block";
        curr.style.transform="rotateY(0deg)";
        curr.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
}

overview.addEventListener("click",()=>{
    pageFlipAnimation(overviewArea,overview);
});
tasks.addEventListener("click",()=>{
    pageFlipAnimation(taskArea,tasks);
});
activity.addEventListener("click",()=>{
    pageFlipAnimation(activityArea,activity);
});
discussion.addEventListener("click",()=>{
    pageFlipAnimation(discussionArea,discussion);
});
notes.addEventListener("click",()=>{
    pageFlipAnimation(notesArea,notes);
});

inviteCardButton.addEventListener("click",()=>{
    invitePageHolder.style.display="flex";
    document.body.style.overflow="hidden";
    invitePage.style.animation="invitePage 0.3s linear 0s forwards";
})
cancelBtn.addEventListener("click",()=>{
    invitePage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        invitePageHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})
async function reload(){
    const projectId=window.location.pathname.split("/").pop();
    const allMembers=await fetch(`/dashboard/projects/${projectId}/team`,{
        method:"get"
    });
    const members=await allMembers.json();
    workHeading.innerHTML=`${members.projectName}`;
    console.log(members.projectName);
    const list=document.createElement("li");
    list.innerHTML=
        `<i class="fa-solid fa-crown"></i><pre style="display:inline-block;font-weight:550;"> ${members.owner} (Full Stack Developer) </pre><span style="color:rgb(7, 72, 84);font-weight:550;"> Owner</span>`
    teamList.appendChild(list);
    if(members.memberPosition!=="Owner"){
        if(members.memberPosition==="Admin"){
            manageTeamButton.style.display="none";
        }else{
            manageTeamButton.style.display="none";
            inviteCardButton.style.display="none";
        }
    }
    if(members.team.length===0){
        return;
    }
    members.team.forEach((member)=>{
        const li=document.createElement("li");
        li.innerHTML=
            `<i class="fa-solid fa-user"></i><pre style="display:inline-block;font-weight:549;"> ${member.member.fullName} (${member.spaciality}) </pre><span style="color:rgb(7, 72, 84);"> ${member.position}</span></li>`;
        teamList.appendChild(li);
    })
}
reload();

inviteForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const positionInput=document.querySelector('input[name="position"]:checked');
    const projectId=window.location.pathname.split("/").pop();
    const body={
        projectId:projectId,
        memberEmail:emailInput.value,
        spaciality:spacialityInput.value,
        position:positionInput.value
    }
    console.log(projectId);
    const member=await fetch(`/dashboard/projects/${projectId}/team`,{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await member.json();
    console.log(result);
    if(result.success===true){
        invitePage.style.animation="cancelPage 0.3s linear 0s forwards";
        setTimeout(()=>{
            invitePageHolder.style.display="none";
            document.body.style.overflow="auto";
        },300);
        const li=document.createElement("li");
        li.innerHTML=
            `<i class="fa-solid fa-user"></i><pre style="display:inline-block;font-weight:549;"> ${result.member.fullName} (${body.spaciality}) </pre><span style="color:rgb(7, 72, 84);"> ${body.position}</span></li>`;
        teamList.appendChild(li);
    }
})

manageTeamButton.addEventListener("click",async ()=>{
    const projectId=window.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/team/manage`,{
        method:"get"
    })
    const result=await response.json();
    console.log(result);
    manageFormDataHolder.innerHTML="";
    result.arr.forEach((teamMember)=>{
        const div=document.createElement("div");
        div.classList.add("manageMember");
        div.dataset.teamId=teamMember._id;
        div.innerHTML=
            `<pre class="managePara" style="display:inline-block;font-weight:549;"><i class="fa-solid fa-user"></i> ${teamMember.member.fullName} (${teamMember.spaciality}) <span style="color:rgb(7, 72, 84);"> ${teamMember.position}</span></pre>
            <div id="manageButtonsHolder">
                <button class="manageButton manageAdminButton">Change Role</button>
                <button class="manageButton manageRemoveMember">Remove Member</button>
            </div>`;
        manageFormDataHolder.appendChild(div);
    })
   manageFormPlaceHolder.style.display="flex";
   manageFormContainer.style.animation="invitePage 0.3s linear 0s forwards";
   document.body.style.overflow="hidden";
})

manageFormCancelButton.addEventListener("click",()=>{
    manageFormContainer.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        manageFormPlaceHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})

document.addEventListener("click",async (e)=>{
    if
    (e.target.classList.contains("manageAdminButton")){
        const row=e.target.closest(".manageMember");
        const memberId=row.dataset.teamId;
    
        const projectId=window.location.pathname.split("/").pop();
        const result=await fetch(`/dashboard/projects/${projectId}/team/manage/${memberId}`,{
            method:"PATCH"
        });
        const respond=await result.json();
        updatePage();
    }
})

document.addEventListener("click",async (e)=>{
    if
    (e.target.classList.contains("manageRemoveMember")){
        const row=e.target.closest(".manageMember");
        const memberId=row.dataset.teamId;
    
        const projectId=window.location.pathname.split("/").pop();
        const result=await fetch(`/dashboard/projects/${projectId}/team/manage/${memberId}`,{
            method:"delete"
        });
        const respond=await result.json();
        updatePage();
    }
})

async function updatePage(){
    const projectId=window.location.pathname.split("/").pop();
    const allMembers=await fetch(`/dashboard/projects/${projectId}/team`,{
        method:"get"
    });
    const members=await allMembers.json();
    manageFormDataHolder.innerHTML="";
    teamList.innerHTML="";
    members.team.forEach((teamMember)=>{
        const div=document.createElement("div");
        div.classList.add("manageMember");
        div.dataset.teamId=teamMember._id;
        div.innerHTML=
            `<pre class="managePara" style="display:inline-block;font-weight:549;"><i class="fa-solid fa-user"></i> ${teamMember.member.fullName} (${teamMember.spaciality}) <span style="color:rgb(7, 72, 84);"> ${teamMember.position}</span></pre>
            <div id="manageButtonsHolder">
                <button class="manageButton manageAdminButton">Change Role</button>
                <button class="manageButton manageRemoveMember">Remove Member</button>
            </div>`;
        manageFormDataHolder.appendChild(div);

        const li=document.createElement("li");
        li.innerHTML=
            `<i class="fa-solid fa-user"></i><pre style="display:inline-block;font-weight:549;"> ${teamMember.member.fullName} (${teamMember.spaciality}) </pre><span style="color:rgb(7, 72, 84);"> ${teamMember.position}</span></li>`;
        teamList.appendChild(li);
    })
}