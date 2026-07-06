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

const taskButton=document.querySelector("#taskButton");
const taskAssignmentPageHolder=document.querySelector("#taskAssignmentPageHolder");
const taskAssignmentPage=document.querySelector("#taskAssignmentPage");
const taskCancelBtn=document.querySelector("#taskCancelBtn");
const taskAssignForm=document.querySelector("#taskAssignForm");
const taskInput=document.querySelector("#taskInput");
const taskSelection=document.querySelector("#taskSelection");
const taskDeadline=document.querySelector("#taskAssignmentDate");
const assignedTasks=document.querySelector("#assignedTasks");
let filteredTasks=[];

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
    const list=document.createElement("li");
    list.innerHTML=
        `<i class="fa-solid fa-crown"></i><pre style="display:inline-block;font-weight:550;"> ${members.owner} </pre><span style="color:rgb(7, 72, 84);font-weight:550;"> Owner</span>`
    teamList.appendChild(list);
    if(members.memberPosition!=="Owner"){
        if(members.memberPosition==="Admin"){
            manageTeamButton.style.display="none";
        }else{
            manageTeamButton.style.display="none";
            inviteCardButton.style.display="none";
            taskButton.style.display="none";
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
    const list=document.createElement("li");
    list.innerHTML=
        `<i class="fa-solid fa-crown"></i><pre style="display:inline-block;font-weight:550;"> ${members.owner} </pre><span style="color:rgb(7, 72, 84);font-weight:550;"> Owner</span>`
    teamList.appendChild(list);
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

taskButton.addEventListener("click",async ()=>{
    const projectId=window.location.pathname.split("/").pop();
    const taskMembers=await fetch(`/dashboard/projects/${projectId}/task/names`,{
        method:"get"
    });
    const taskMemberList=await taskMembers.json();
    taskSelection.innerHTML="";
    if(taskMemberList.names.length===0){
        const selectOption=document.createElement("option");
        selectOption.innerText=`No Team Members`;
        taskSelection.appendChild(selectOption);
    }else{
        taskMemberList.names.forEach((name)=>{
            const selectOption=document.createElement("option");
            selectOption.value=name.member._id;
            selectOption.innerText=`${name.member.fullName}`;
            taskSelection.appendChild(selectOption);
        })
    }
    taskAssignmentPageHolder.style.display="flex";
    document.body.style.overflow="hidden";
    taskAssignmentPage.style.animation="invitePage 0.3s linear 0s forwards";
})
taskCancelBtn.addEventListener("click",()=>{
    taskAssignmentPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        taskAssignmentPageHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})

function dateCreater(customizedDate){
    const newDate=new Date(customizedDate);
    return newDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

taskAssignForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectId=window.location.pathname.split("/").pop();
    const priorityInput=document.querySelector('input[name="taskPriority"]:checked');
    const body={
        task:taskInput.value,
        assignedTo:taskSelection.value,
        priority:priorityInput.value,
        taskDeadline:taskDeadline.value
    };
    const taskCreated=await fetch(`/dashboard/projects/${projectId}/task`,{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await taskCreated.json();
    const customizedTaskDeadline=dateCreater(result.createdTask.deadline);
    filteredTasks.push(...[result.createdTask]);
    const div=document.createElement("div");
    div.classList.add("singleTaskHolder");
    div.dataset.taskId=result.createdTask._id;
    div.innerHTML=
        `<p class="taskPara">${result.createdTask.task}</p>
        <hr class="taskHr">
        <div class="taskInfoHolderRow">
            <p class="taskInfoPara">Assigned to <span class="taskInfoAns">${result.createdTask.assignedTo.fullName}</span></p>
            <p class="taskInfoPara">Priority <span class="taskInfoAns">${result.createdTask.priority}</span></p>
        </div>
        <div class="taskInfoHolderRow" style="margin-bottom:0px;">
            <p class="taskInfoPara">Deadline <span class="taskInfoAns">${customizedTaskDeadline}</span></p>
            <p class="taskInfoPara">Status <span class="taskInfoAns">${result.createdTask.status}</span></p>
        </div>
        <hr class="taskHr">
        <div class="singleTaskButtonHolder">
            <button class="singleTaskButton" id="taskStatusButton">Status</button>
            <button class="singleTaskButton" id="taskEditButton">Edit</button>
            <button class="singleTaskButton" id="taskDeleteButton">Delete</button>
        </div>`;
    assignedTasks.appendChild(div);
    taskAssignmentPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        taskAssignmentPageHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})

let currentUser="";
let currUserId="";
let currUserRole="";

async function taskReload(){
    projectId=window.location.pathname.split("/").pop();
    const taskElements=await fetch(`/dashboard/projects/${projectId}/task`,{
        method:"get"
    });
    const allTasks=await taskElements.json();
    if(allTasks.allTasks.length===0){
        return;
    }
    filteredTasks=allTasks.allTasks;
    currentUser=allTasks.user.fullName;
    currUserId=allTasks.user._id.toString();
    currUserRole=allTasks.userRole;
    allTasks.allTasks.forEach((task)=>{
    const customizedTaskDeadline=dateCreater(task.deadline);
    const div=document.createElement("div");
    div.classList.add("singleTaskHolder");
    div.dataset.taskId=task._id;
    if(currUserId!==task.assignedTo._id.toString() && currUserRole==="Member"){
        div.innerHTML=
        `<p class="taskPara">${task.task}</p>
        <hr class="taskHr">
        <div class="taskInfoHolderRow">
            <p class="taskInfoPara">Assigned to <span class="taskInfoAns">${task.assignedTo.fullName}</span></p>
            <p class="taskInfoPara">Priority <span class="taskInfoAns">${task.priority}</span></p>
        </div>
        <div class="taskInfoHolderRow" style="margin-bottom:0px;">
            <p class="taskInfoPara">Deadline <span class="taskInfoAns">${customizedTaskDeadline}</span></p>
            <p class="taskInfoPara">Status <span class="taskInfoAns">${task.status}</span></p>
        </div>`;
    }else{
        div.innerHTML=
        `<p class="taskPara">${task.task}</p>
        <hr class="taskHr">
        <div class="taskInfoHolderRow">
            <p class="taskInfoPara">Assigned to <span class="taskInfoAns">${task.assignedTo.fullName}</span></p>
            <p class="taskInfoPara">Priority <span class="taskInfoAns">${task.priority}</span></p>
        </div>
        <div class="taskInfoHolderRow" style="margin-bottom:0px;">
            <p class="taskInfoPara">Deadline <span class="taskInfoAns">${customizedTaskDeadline}</span></p>
            <p class="taskInfoPara">Status <span class="taskInfoAns">${task.status}</span></p>
        </div>
        <hr class="taskHr">
        <div class="singleTaskButtonHolder">
            <button class="singleTaskButton taskStatusButton">Status</button>
            <button class="singleTaskButton taskEditButton">Edit</button>
            <button class="singleTaskButton taskDeleteButton">Delete</button>
        </div>`;
    }
    assignedTasks.appendChild(div);
    });
    if(currUserRole==="Member"){
        const taskEditButton=document.querySelectorAll(".taskEditButton");
        const taskDeleteButton=document.querySelectorAll(".taskDeleteButton");
        const taskStatusButton=document.querySelectorAll(".taskStatusButton");
        taskEditButton.forEach((button)=>{
            button.style.display="none";
        })
        taskDeleteButton.forEach((button)=>{
            button.style.display="none";
        })
    }
}
taskReload();

const taskAllBtn=document.querySelector("#taskAllBtn");
const myTaskBtn=document.querySelector("#myTaskBtn");
const todoBtn=document.querySelector("#todoBtn");
const inProgressBtn=document.querySelector("#inProgressBtn");
const completedBtn=document.querySelector("#completedBtn");
const highPriorityBtn=document.querySelector("#highPriorityBtn");
const mediumPriorityBtn=document.querySelector("#mediumPriorityBtn");
const lowPriorityBtn=document.querySelector("#lowPriorityBtn");

let filterTask="All";
taskAllBtn.addEventListener("click",()=>{
    filterTask="All";
    taskUpdation();
});
myTaskBtn.addEventListener("click",()=>{
    filterTask="MyTasks";
    taskUpdation();
});
todoBtn.addEventListener("click",()=>{
    filterTask="Todo";
    taskUpdation();
});
inProgressBtn.addEventListener("click",()=>{
    filterTask="In Progress";
    taskUpdation();
});
completedBtn.addEventListener("click",()=>{
    filterTask="Completed";
    taskUpdation();
});
highPriorityBtn.addEventListener("click",()=>{
    filterTask="High";
    taskUpdation();
});
lowPriorityBtn.addEventListener("click",()=>{
    filterTask="Low";
    taskUpdation();
});
mediumPriorityBtn.addEventListener("click",()=>{
    filterTask="Medium";
    taskUpdation();
});

async function taskUpdation(){
    let filtered=filteredTasks;
    if(filterTask==="MyTasks"){
        filtered=filtered.filter((task)=>{
            return task.assignedTo.fullName===currentUser;
        })
    }
    if(filterTask==="Todo" || filterTask==="In Progress" || filterTask==="Completed"){
        filtered=filtered.filter((task)=>{
            return task.status===filterTask;
        })
    }
    if(filterTask==="High" || filterTask==="Low" || filterTask==="Medium"){
        filtered=filtered.filter((task)=>{
            return task.priority===filterTask;
        })
    }
    assignedTasks.innerHTML="";
    if(filtered.length!==0){
        filtered.forEach((task)=>{
            const customizedTaskDeadline=dateCreater(task.deadline);
            const div=document.createElement("div");
            div.classList.add("singleTaskHolder");
            div.dataset.taskId=task._id;
            if(currUserId!==task.assignedTo._id.toString() && currUserRole==="Member"){
                div.innerHTML=
                `<p class="taskPara">${task.task}</p>
                <hr class="taskHr">
                <div class="taskInfoHolderRow">
                    <p class="taskInfoPara">Assigned to <span class="taskInfoAns">${task.assignedTo.fullName}</span></p>
                    <p class="taskInfoPara">Priority <span class="taskInfoAns">${task.priority}</span></p>
                </div>
                <div class="taskInfoHolderRow" style="margin-bottom:0px;">
                    <p class="taskInfoPara">Deadline <span class="taskInfoAns">${customizedTaskDeadline}</span></p>
                    <p class="taskInfoPara">Status <span class="taskInfoAns">${task.status}</span></p>
                </div>`;
            }else{
                div.innerHTML=
                `<p class="taskPara">${task.task}</p>
                <hr class="taskHr">
                <div class="taskInfoHolderRow">
                    <p class="taskInfoPara">Assigned to <span class="taskInfoAns">${task.assignedTo.fullName}</span></p>
                    <p class="taskInfoPara">Priority <span class="taskInfoAns">${task.priority}</span></p>
                </div>
                <div class="taskInfoHolderRow" style="margin-bottom:0px;">
                    <p class="taskInfoPara">Deadline <span class="taskInfoAns">${customizedTaskDeadline}</span></p>
                    <p class="taskInfoPara">Status <span class="taskInfoAns">${task.status}</span></p>
                </div>
                <hr class="taskHr">
                <div class="singleTaskButtonHolder">
                    <button class="singleTaskButton taskStatusButton">Status</button>
                    <button class="singleTaskButton taskEditButton">Edit</button>
                    <button class="singleTaskButton taskDeleteButton">Delete</button>
                </div>`;
            }
            assignedTasks.appendChild(div);
        });
        if(currUserRole==="Member"){
            const taskEditButton=document.querySelectorAll(".taskEditButton");
            const taskDeleteButton=document.querySelectorAll(".taskDeleteButton");
            const taskStatusButton=document.querySelectorAll(".taskStatusButton");
            taskEditButton.forEach((button)=>{
                button.style.display="none";
            })
            taskDeleteButton.forEach((button)=>{
                button.style.display="none";
            })
        }
    }
}

document.addEventListener("click",async (e)=>{
    if
    (e.target.classList.contains("taskDeleteButton")){
        const row=e.target.closest(".singleTaskHolder");
        const taskId=row.dataset.taskId;
    
        const projectId=window.location.pathname.split("/").pop();
        const result=await fetch(`/dashboard/projects/${projectId}/task/manage/${taskId}`,{
            method:"patch"
        });
        const respond=await result.json();
        console.log(respond);
    }
})