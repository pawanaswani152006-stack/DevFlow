const socket=io();

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
const statusCancelBtn=document.querySelector("#statusCancelBtn");
const taskStatusPageHolder=document.querySelector("#taskManage");
const taskStatusUpdatePage=document.querySelector("#taskStatusUpdatePage");
const currStatusAns=document.querySelector("#currStatusAns");
const taskStatusForm=document.querySelector("#taskStatusForm");
let currTaskId=null;
let filteredTasks=[];

const taskEditForm=document.querySelector("#taskEditForm");
const taskEditPageHolder=document.querySelector("#taskEditPageHolder");
const taskEditPage=document.querySelector("#taskEditPage");
const taskEditInput=document.querySelector("#taskEditInput");
const taskEditDate=document.querySelector("#taskEditDate");
const taskEditBtn=document.querySelector("#taskEditBtn");
const taskEditCancelBtn=document.querySelector("#taskEditCancelBtn");
const taskEditSelection=document.querySelector("#taskEditSelection");

const noTaskStateHolder=document.querySelector("#noTaskStateHolder");
const noActivityStateHolder=document.querySelector("#noActivityStateHolder");
const noPersonalNotesStateHolder=document.querySelector("#noPersonalNotesStateHolder");
const noPersonalPdfStateHolder=document.querySelector("#noPersonalPdfStateHolder");
const noTeamPdfStateHolder=document.querySelector("#noTeamPdfStateHolder");

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

const overviewProgressCardDataHolder=document.querySelector("#overviewProgressCardDataHolder");
const overviewTotalTaskDataHolder=document.querySelector("#overviewTotalTaskDataHolder");
const overviewTotalTeamMembersDataHolder=document.querySelector("#overviewTotalTeamMembersDataHolder");
const overviewProjectDeadlineDataHolder=document.querySelector("#overviewProjectDeadlineDataHolder");
const overviewRecentTaskCardDataHolder=document.querySelector("#overviewRecentTaskCardDataHolder");
const overviewRecentActivityDataHolder=document.querySelector("#overviewRecentActivityDataHolder");

const overviewNoRecentTaskStateHolder=document.querySelector("#overviewNoRecentTaskStateHolder");
const overviewNoRecentactivityStateHolder=document.querySelector("#overviewNoRecentactivityStateHolder");


async function reload(){
    const projectId=window.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/overview`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        workHeading.innerHTML=`${result.project.projectName}`;
        overviewProjectDeadlineDataHolder.innerText=`${dateCreater(result.project.deadline)}`
        teamList.innerHTML="";
        const list=document.createElement("li");
        list.innerHTML=
            `<i class="fa-solid fa-crown"></i><pre style="display:inline-block;font-weight:550;"> ${result.project.owner.fullName} </pre><span style="color:rgb(7, 72, 84);font-weight:550;"> Owner</span>`
        teamList.appendChild(list);
        if(result.position!=="Owner"){
            if(result.position==="Admin"){
                manageTeamButton.style.display="none";
            }else{
                manageTeamButton.style.display="none";
                inviteCardButton.style.display="none";
                taskButton.style.display="none";
            }
        }
        overviewTotalTaskDataHolder.innerText=`${result.myTask}`;
        overviewTotalTeamMembersDataHolder.innerText=`${result.teamLength+1}`;
        overviewProgressCardDataHolder.innerText=`${result.progress}`;
        overviewRecentActivityDataHolder.innerHTML="";
        overviewRecentTaskCardDataHolder.innerHTML="";
        if(result.recentTasks.length!==0){
            overviewNoRecentTaskStateHolder.style.display="none";
            result.recentTasks.forEach((task)=>{
                const li=document.createElement("li");
                li.innerHTML=
                    `<i class="fa-solid fa-user"></i><pre style="display:inline-block;font-weight:549;">${task.assignedTo.fullName}</pre> <span style="color:rgb(7, 72, 84);">${task.task}</span>`;
                overviewRecentTaskCardDataHolder.appendChild(li);
            })
        }else{
            overviewNoRecentTaskStateHolder.style.display="block";
            overviewNoRecentTaskStateHolder.style.animation="emptyCommentShow 0.3s linear 0s forwards";
            setTimeout(()=>{
                overviewNoRecentTaskStateHolder.style.animation="";
            },300);
        }
        if(result.recentActivity.length!==0){
            overviewNoRecentactivityStateHolder.style.display="none";
            result.recentActivity.forEach((activity)=>{
                const li=document.createElement("li");
                li.innerHTML=
                    `<i class="fa-solid fa-right-long"></i> <span style="color:rgb(7, 72, 84);">${activity.message}</span>`
                overviewRecentActivityDataHolder.appendChild(li);
            })
        }else{
            overviewNoRecentactivityStateHolder.style.display="block";
            overviewNoRecentactivityStateHolder.style.animation="emptyCommentShow 0.3s linear 0s forwards";
            setTimeout(()=>{
                overviewNoRecentactivityStateHolder.style.animation="";
            },300);
        }
        if(result.teamLength===0){
            return;
        }
        result.teamMembers.forEach((member)=>{
            const li=document.createElement("li");
            li.innerHTML=
                `<i class="fa-solid fa-user"></i><pre style="display:inline-block;font-weight:549;"> ${member.member.fullName} (${member.spaciality}) </pre><span style="color:rgb(7, 72, 84);"> ${member.position}</span></li>`;
            teamList.appendChild(li);
        })
    }
}
reload();

inviteForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const positionInput=document.querySelector('input[name="position"]:checked');
    const projectId=window.location.pathname.split("/").pop();
    const body={
        memberEmail:emailInput.value,
        spaciality:spacialityInput.value,
        position:positionInput.value
    }
    const member=await fetch(`/dashboard/projects/${projectId}/team`,{
        method:"post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await member.json();
    if(result.msg==="success"){
        reload();
        activityReload();
        discussionOptionReload();
        invitePage.style.animation="cancelPage 0.3s linear 0s forwards";
        setTimeout(()=>{
            invitePageHolder.style.display="none";
            document.body.style.overflow="auto";
        },300);
    }
})

manageTeamButton.addEventListener("click",async ()=>{
    const projectId=window.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/team/manage`,{
        method:"get"
    })
    const result=await response.json();
    if(result.msg==="success"){
        manageFormDataHolder.innerHTML="";
        result.arr.forEach((teamMember)=>{
            const div=document.createElement("div");
            div.classList.add("manageMember");
            div.dataset.teamId=teamMember._id;
            div.innerHTML=
                `<pre class="managePara" style="display:inline-block;font-weight:549;"><i class="fa-solid fa-user"></i> ${teamMember.member.fullName} (${teamMember.spaciality}) <span style="color:rgb(7, 72, 84);"> ${teamMember.position}</span></pre>
                <div id="manageButtonsHolder">
                    <button class="manageButton manageRoleButton">Change Role</button>
                    <button class="manageButton manageRemoveMember">Remove Member</button>
                </div>`;
            manageFormDataHolder.appendChild(div);
        })
        manageFormPlaceHolder.style.display="flex";
        manageFormContainer.style.animation="invitePage 0.3s linear 0s forwards";
        document.body.style.overflow="hidden";
    }
})

manageFormCancelButton.addEventListener("click",()=>{
    manageFormContainer.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        manageFormPlaceHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".manageRoleButton")){
        const row=e.target.closest(".manageMember");
        const memberId=row.dataset.teamId;
    
        const projectId=window.location.pathname.split("/").pop();
        const result=await fetch(`/dashboard/projects/${projectId}/team/manage/${memberId}`,{
            method:"PATCH"
        });
        const respond=await result.json();
        if(respond.msg==="success"){
            activityReload();
            updatePage();
        }
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
        if(respond.msg==="success"){
            activityReload();
            updatePage();
            discussionOptionReload();
        }
    }
})

async function updatePage(){
    const projectId=window.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/team`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        manageFormDataHolder.innerHTML="";
        result.team.forEach((teamMember)=>{
            const div=document.createElement("div");
            div.classList.add("manageMember");
            div.dataset.teamId=teamMember._id;
            div.innerHTML=
                `<pre class="managePara" style="display:inline-block;font-weight:549;"><i class="fa-solid fa-user"></i> ${teamMember.member.fullName} (${teamMember.spaciality}) <span style="color:rgb(7, 72, 84);"> ${teamMember.position}</span></pre>
                <div id="manageButtonsHolder">
                    <button class="manageButton manageRoleButton">Change Role</button>
                    <button class="manageButton manageRemoveMember">Remove Member</button>
                </div>`;
            manageFormDataHolder.appendChild(div);
        })
    }
}

let isNoTeamMember=false;
taskButton.addEventListener("click",async ()=>{
    const projectId=window.location.pathname.split("/").pop();
    const taskMembers=await fetch(`/dashboard/projects/${projectId}/task/names`,{
        method:"get"
    });
    const taskMemberList=await taskMembers.json();
    if(taskMemberList.msg==="success"){
        taskInput.value="";
        taskDeadline.value="";
        taskSelection.innerHTML="";
        if(taskMemberList.names.length===0){
            if(taskMemberList.position!=="Owner"){
                isNoTeamMember=true;
                const selectOption=document.createElement("option");
                selectOption.innerText=`No Team Members`;
                taskSelection.appendChild(selectOption);
            }
        }else{
            isNoTeamMember=false;
            taskMemberList.names.forEach((name)=>{
                const selectOption=document.createElement("option");
                selectOption.value=name.member._id;
                selectOption.innerText=`${name.member.fullName}`;
                taskSelection.appendChild(selectOption);
            })
        }
        if(taskMemberList.position==="Owner"){
            const selectOption=document.createElement("option");
            selectOption.selected=true;
            selectOption.value=taskMemberList.owner._id;
            selectOption.innerText=`${taskMemberList.owner.fullName}`;
            taskSelection.prepend(selectOption);
        }
        taskAssignmentPageHolder.style.display="flex";
        document.body.style.overflow="hidden";
        taskAssignmentPage.style.animation="invitePage 0.3s linear 0s forwards";
    }
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
    if(isNoTeamMember){
        taskInput.value="";
        taskDeadline.value="";
        return;
    }
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
    if(result.msg==="success"){
        activityReload();
        noTaskStateHolder.style.display="none";
        taskAssignmentPage.style.animation="cancelPage 0.3s linear 0s forwards";
        setTimeout(()=>{
            taskAssignmentPageHolder.style.display="none";
            document.body.style.overflow="auto";
        },300);
        filterTask="All";
        statusFilterTasks=null;
        priorityFilterTasks=null;
        taskAllBtn.style.backgroundColor="rgb(51, 160, 160)";
        myTaskBtn.style.backgroundColor="rgb(152, 240, 247)";
        todoBtn.style.backgroundColor="rgb(152, 240, 247)";
        inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
        completedBtn.style.backgroundColor="rgb(152, 240, 247)";
        highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
        mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
        lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
        taskReload();
    }
});

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".taskStatusButton")){
        const row=e.target.closest(".singleTaskHolder");
        const taskId=row.dataset.taskId;
        currTaskId=row.dataset.taskId;
        const response=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
            method:"get"
        });
        const result=await response.json();
        if(result.msg==="success"){
            currStatusAns.innerText=`  ${result.currStatus}`;
            taskStatusPageHolder.style.display="flex";
            taskStatusUpdatePage.style.animation="invitePage 0.3s linear 0s forwards";
            document.body.style.overflow="hidden";
        }
    }
})
document.addEventListener("click",async (e)=>{
    if(e.target.closest(".taskEditsButton")){
        const row=e.target.closest(".singleTaskHolder");
        const taskId=row.dataset.taskId;
        currTaskId=row.dataset.taskId;
        const result=await fetch(`/dashboard/projects/${projectId}/editTask/${taskId}`,{
            method:"get"
        });
        const response=await result.json();
        if(response.msg==="success"){
            taskEditPageHolder.style.display="flex";
            taskEditPage.style.animation="invitePage 0.3s linear 0s forwards";
            document.body.style.overflow="hidden";
            taskEditInput.value=response.task.task;
            taskEditDate.value=correctDateCreator(response.task.deadline);
            currTaskPriority=response.task.priority.trim();
            taskEditSelection.innerHTML="";
            response.names.forEach((name)=>{
                const option=document.createElement("option");
                option.innerText=`${name.member.fullName}`;
                option.value=name.member._id.toString();
                if(response.task.assignedTo.toString()===name.member._id.toString()){
                    option.selected=true;
                }
                taskEditSelection.appendChild(option);
            })
            if(response.position==="Owner"){
                const option=document.createElement("option");
                option.innerText=`${response.owner.fullName}`;
                option.value=response.owner._id.toString();
                if(response.task.assignedTo.toString()===response.owner._id.toString()){
                    option.selected=true;
                }
                taskEditSelection.appendChild(option);
            }
        }
    }
})
document.addEventListener("click",async (e)=>{
    if(e.target.closest(".taskDeleteButton")){
        const row=e.target.closest(".singleTaskHolder");
        const taskId=row.dataset.taskId;
        const response=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
            method:"delete"
        });
        const result=await response.json();
        if(result.msg==="success"){
            filteredTasks=filteredTasks.filter((task)=>{
                return task._id!==taskId;
            })
            taskAllBtn.style.backgroundColor="rgb(51, 160, 160)";
            myTaskBtn.style.backgroundColor="rgb(152, 240, 247)";
            todoBtn.style.backgroundColor="rgb(152, 240, 247)";
            inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
            completedBtn.style.backgroundColor="rgb(152, 240, 247)";
            highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
            mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
            lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
            filterTask="All";
            statusFilterTasks=null;
            priorityFilterTasks=null;
            taskReload();
            activityReload();
        }
    }
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
    if(allTasks.msg==="success"){
        filterTask="All";
        statusFilterTasks=null;
        priorityFilterTasks=null;
        taskAllBtn.style.backgroundColor="rgb(51, 160, 160)";
        myTaskBtn.style.backgroundColor="rgb(152, 240, 247)";
        todoBtn.style.backgroundColor="rgb(152, 240, 247)";
        inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
        completedBtn.style.backgroundColor="rgb(152, 240, 247)";
        highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
        mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
        lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
        filteredTasks=allTasks.allTasks;
        currentUser=allTasks.user.fullName;
        currUserId=allTasks.user._id.toString();
        currUserRole=allTasks.userRole;
        assignedTasks.innerHTML="";
        if(allTasks.allTasks.length===0){
            overviewTotalTaskDataHolder.innerText=`0`;
            noTaskStateHolder.style.display="block";
            noTaskStateHolder.style.animation="emptyCommentShow 0.3s linear 0s forwards";
            setTimeout(()=>{
                noTaskStateHolder.style.animation="";
                return;
            },300);
        }
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
                    <button class="singleTaskButton taskEditsButton">Edit</button>
                    <button class="singleTaskButton taskDeleteButton">Delete</button>
                </div>`;
            }
            assignedTasks.prepend(div);
        });
        if(allTasks.allTasks.length===0){
            mediumPriorityBtn.style.backgroundColor="rgb(118, 135, 135)";
            myTaskBtn.style.backgroundColor="rgb(118, 135, 135)";
            todoBtn.style.backgroundColor="rgb(118, 135, 135)";
            inProgressBtn.style.backgroundColor="rgb(118, 135, 135)";
            completedBtn.style.backgroundColor="rgb(118, 135, 135)";
            highPriorityBtn.style.backgroundColor="rgb(118, 135, 135)";
            taskAllBtn.style.backgroundColor="rgb(118, 135, 135)";
            lowPriorityBtn.style.backgroundColor="rgb(118, 135, 135)";
            mediumPriorityBtn.disabled=true;
            myTaskBtn.disabled=true;
            todoBtn.disabled=true;
            inProgressBtn.disabled=true;
            completedBtn.disabled=true;
            highPriorityBtn.disabled=true;
            taskAllBtn.disabled=true;
            lowPriorityBtn.disabled=true;
        }else{
            mediumPriorityBtn.disabled=false;
            myTaskBtn.disabled=false;
            todoBtn.disabled=false;
            inProgressBtn.disabled=false;
            completedBtn.disabled=false;
            highPriorityBtn.disabled=false;
            taskAllBtn.disabled=false;
            lowPriorityBtn.disabled=false;
        }
        if(currUserRole==="Member"){
            const taskEditsButton=document.querySelectorAll(".taskEditsButton");
            const taskDeleteButton=document.querySelectorAll(".taskDeleteButton");
            const taskStatusButton=document.querySelectorAll(".taskStatusButton");
            taskEditsButton.forEach((button)=>{
                button.style.display="none";
            })
            taskDeleteButton.forEach((button)=>{
                button.style.display="none";
            })
        }
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
let statusFilterTasks=null;
let priorityFilterTasks=null;
taskAllBtn.addEventListener("click",()=>{
    taskAllBtn.style.backgroundColor="rgb(51, 160, 160)";
    myTaskBtn.style.backgroundColor="rgb(152, 240, 247)";
    todoBtn.style.backgroundColor="rgb(152, 240, 247)";
    inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
    completedBtn.style.backgroundColor="rgb(152, 240, 247)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    filterTask="All";
    statusFilterTasks=null;
    priorityFilterTasks=null;
    taskUpdation();
});
myTaskBtn.addEventListener("click",()=>{
    myTaskBtn.style.backgroundColor="rgb(51, 160, 160)";
    taskAllBtn.style.backgroundColor="rgb(152, 240, 247)";
    todoBtn.style.backgroundColor="rgb(152, 240, 247)";
    inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
    completedBtn.style.backgroundColor="rgb(152, 240, 247)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    filterTask="MyTasks";
    statusFilterTasks=null;
    priorityFilterTasks=null;
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});
todoBtn.addEventListener("click",()=>{
    todoBtn.style.backgroundColor="rgb(51, 160, 160)";
    inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
    completedBtn.style.backgroundColor="rgb(152, 240, 247)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    statusFilterTasks="Todo";
    priorityFilterTasks=null;
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});
inProgressBtn.addEventListener("click",()=>{
    inProgressBtn.style.backgroundColor="rgb(51, 160, 160)";
    todoBtn.style.backgroundColor="rgb(152, 240, 247)";
    completedBtn.style.backgroundColor="rgb(152, 240, 247)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    statusFilterTasks="In Progress";
    priorityFilterTasks=null;
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});
completedBtn.addEventListener("click",()=>{
    completedBtn.style.backgroundColor="rgb(51, 160, 160)";
    todoBtn.style.backgroundColor="rgb(152, 240, 247)";
    inProgressBtn.style.backgroundColor="rgb(152, 240, 247)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    statusFilterTasks="Completed";
    priorityFilterTasks=null;
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});
highPriorityBtn.addEventListener("click",()=>{
    highPriorityBtn.style.backgroundColor="rgb(51, 160, 160)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    priorityFilterTasks="High";
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});
lowPriorityBtn.addEventListener("click",()=>{
    lowPriorityBtn.style.backgroundColor="rgb(51, 160, 160)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    mediumPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    priorityFilterTasks="Low";
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});
mediumPriorityBtn.addEventListener("click",()=>{
    mediumPriorityBtn.style.backgroundColor="rgb(51, 160, 160)";
    highPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    lowPriorityBtn.style.backgroundColor="rgb(152, 240, 247)";
    priorityFilterTasks="Medium";
    // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
    taskUpdation();
});

function taskUpdation(){
    let filtered=filteredTasks;
    if(filterTask==="MyTasks"){
        filtered=filtered.filter((task)=>{
            return task.assignedTo.fullName===currentUser;
        })
    }
    if(statusFilterTasks==="Todo" || statusFilterTasks==="In Progress" || statusFilterTasks==="Completed"){
        filtered=filtered.filter((task)=>{
            return task.status===statusFilterTasks;
        })
    }
    if(priorityFilterTasks==="High" || priorityFilterTasks==="Low" || priorityFilterTasks==="Medium"){
        filtered=filtered.filter((task)=>{
            return task.priority===priorityFilterTasks;
        })
    }
    assignedTasks.innerHTML="";
    if(filtered.length!==0){
        // noTaskStateHolder.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            noTaskStateHolder.style.display="none";
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
                        <button class="singleTaskButton taskEditsButton">Edit</button>
                        <button class="singleTaskButton taskDeleteButton">Delete</button>
                    </div>`;
                }
                assignedTasks.prepend(div);
            });
            if(currUserRole==="Member"){
                const taskEditsButton=document.querySelectorAll(".taskEditsButton");
                const taskDeleteButton=document.querySelectorAll(".taskDeleteButton");
                const taskStatusButton=document.querySelectorAll(".taskStatusButton");
                taskEditsButton.forEach((button)=>{
                    button.style.display="none";
                })
                taskDeleteButton.forEach((button)=>{
                    button.style.display="none";
                })
            }
    }else{
        noTaskStateHolder.style.display="block";
        // noTaskStateHolder.style.animation="";
        noTaskStateHolder.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            noTaskStateHolder.style.animation="";
        },300);
    }
}

statusCancelBtn.addEventListener("click",()=>{
    taskStatusUpdatePage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        taskStatusPageHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})

taskStatusForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectId=window.location.pathname.split("/").pop();
    const taskId=currTaskId;
    const updatedTaskInput=document.querySelector('input[name="editStatus"]:checked');
    const body={
        newStatus:updatedTaskInput.value
    };
    const editStatus=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
        method:"PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await editStatus.json();
    if(result.msg==="success"){
        taskStatusUpdatePage.style.animation="cancelPage 0.3s linear 0s forwards";
        setTimeout(()=>{
            taskStatusPageHolder.style.display="none";
            document.body.style.overflow="auto";
            taskReload();
            activityReload();
        },300);
    }
})

taskEditCancelBtn.addEventListener("click",()=>{
    taskEditPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        taskEditPageHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})
taskEditForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectId=document.location.pathname.split("/").pop();
    const taskId=currTaskId;
    const radio=document.querySelector(`input[name="taskEditPriority"]:checked`);
    body={
        task:taskEditInput.value,
        assignTo:taskEditSelection.value,
        priority:radio.value,
        deadline:taskEditDate.value
    };
    const result=await fetch(`/dashboard/projects/${projectId}/task/${taskId}/edit`,{
        method:"PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    });
    const response=await result.json();
    if(response.msg==="success"){
        taskEditPage.style.animation="cancelPage 0.3s linear 0s forwards";
        setTimeout(()=>{
            taskEditPageHolder.style.display="none";
            document.body.style.overflow="auto";
        },300);
        taskReload();
        activityReload();
    }
})

let allActivitiesForFilter=[];
const activityHolder=document.querySelector("#activityHolder");
async function activityReload(){
    const projectId=document.location.pathname.split("/").pop();
    const activity=await fetch(`/dashboard/projects/${projectId}/activity`,{
        method:"get"
    });
    const allActivities=await activity.json();
    if(allActivities.msg==="success"){
        activityFilter="All";
        activityAllButton.style.backgroundColor="rgb(51, 160, 160)";
        activityTaskButton.style.backgroundColor="rgb(152, 240, 247)";
        activityTeamButton.style.backgroundColor="rgb(152, 240, 247)";
        activityPdfButton.style.backgroundColor="rgb(152, 240, 247)";
        activityProjectButton.style.backgroundColor="rgb(152, 240, 247)";
        allActivitiesForFilter=allActivities.activity;
        activityHolder.innerHTML="";
        if(allActivities.activity.length!==0){
            noActivityStateHolder.style.display="none";
            activityAllButton.disabled=false;
            activityTaskButton.disabled=false;
            activityTeamButton.disabled=false;
            activityProjectButton.disabled=false;
            activityPdfButton.disabled=false;
            allActivities.activity.forEach((singleActivity)=>{
                const div=document.createElement("div");
                const hr=document.createElement("hr");
                div.classList.add("singleActivityHolder");
                hr.classList.add("activityHr");
                div.innerHTML=
                    `<p class="activityPara">${singleActivity.message}</p>
                    <p class="activityTimeline" data-created-at="${singleActivity.createdAt.toString()}">${getRelativeTime(singleActivity.createdAt.toString())}</p>`;
                activityHolder.prepend(hr);
                activityHolder.prepend(div);
            });
        }else{
            activityAllButton.style.backgroundColor="rgb(91, 107, 107)";
            activityTaskButton.style.backgroundColor="rgb(91, 107, 107)";
            activityTeamButton.style.backgroundColor="rgb(91, 107, 107)";
            activityProjectButton.style.backgroundColor="rgb(91, 107, 107)";
            activityPdfButton.style.backgroundColor="rgb(91, 107, 107)";
            activityAllButton.disabled=true;
            activityTaskButton.disabled=true;
            activityTeamButton.disabled=true;
            activityPdfButton.disabled=true;
            activityProjectButton.disabled=true;
            noActivityStateHolder.style.display="block";
            noActivityStateHolder.style.animation="emptyCommentShow 0.3s linear 0s forwards";
            setTimeout(()=>{
                noActivityStateHolder.style.animation="";
            },300);
        }
        reload();
    }
}
activityReload();

function getRelativeTime(createdAt){
    let created=new Date(createdAt);
    let now=new Date();
    let diff=now-created;
    let seconds=Math.floor(diff / 1000);
    let minutes=Math.floor(diff / (1000*60));
    let hours=Math.floor(diff / (1000*60*60));
    let days=Math.floor(diff / (1000*60*60*24));
    
    if(seconds<60) return "Just now";
    if(minutes<60) return `${minutes} min ago`;
    if(hours<24) return `${hours} ${hours===1?"hour":"hours"} ago`;
    if(days<7) return `${days} ${days===1?"day":"days"} ago`;

    return created.toLocaleDateString("en-IN",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    });
}

function updateActivityTime(){
    let allTime=document.querySelectorAll(".activityTimeline");
    if(allTime.length!==0){
        allTime.forEach((item)=>{
            let createdAt=item.dataset.createdAt;
            let time=getRelativeTime(createdAt);
            item.innerText=time;
        })
    }
}
setInterval(updateActivityTime,60000);

const activityAllButton=document.querySelector("#activityAllButton");
const activityTaskButton=document.querySelector("#activityTaskButton");
const activityTeamButton=document.querySelector("#activityTeamButton");
const activityPdfButton=document.querySelector("#activityPdfButton");
const activityProjectButton=document.querySelector("#activityProjectButton");
let activityFilter="All";

activityAllButton.addEventListener("click",()=>{
    activityFilter="All";
    activityAllButton.style.backgroundColor="rgb(51, 160, 160)";
    activityTaskButton.style.backgroundColor="rgb(152, 240, 247)";
    activityTeamButton.style.backgroundColor="rgb(152, 240, 247)";
    activityPdfButton.style.backgroundColor="rgb(152, 240, 247)";
    activityProjectButton.style.backgroundColor="rgb(152, 240, 247)";
    activityFilterUpdation()
});

activityTaskButton.addEventListener("click",()=>{
    activityFilter="Task";
    activityTaskButton.style.backgroundColor="rgb(51, 160, 160)";
    activityAllButton.style.backgroundColor="rgb(152, 240, 247)";
    activityTeamButton.style.backgroundColor="rgb(152, 240, 247)";
    activityPdfButton.style.backgroundColor="rgb(152, 240, 247)";
    activityProjectButton.style.backgroundColor="rgb(152, 240, 247)";
    activityFilterUpdation()
});

activityTeamButton.addEventListener("click",()=>{
    activityFilter="Team";
    activityTeamButton.style.backgroundColor="rgb(51, 160, 160)";
    activityTaskButton.style.backgroundColor="rgb(152, 240, 247)";
    activityAllButton.style.backgroundColor="rgb(152, 240, 247)";
    activityPdfButton.style.backgroundColor="rgb(152, 240, 247)";
    activityProjectButton.style.backgroundColor="rgb(152, 240, 247)";
    activityFilterUpdation()
});

activityPdfButton.addEventListener("click",()=>{
    activityFilter="Pdf";
    activityTeamButton.style.backgroundColor="rgb(152, 240, 247)";
    activityTaskButton.style.backgroundColor="rgb(152, 240, 247)";
    activityAllButton.style.backgroundColor="rgb(152, 240, 247)";
    activityPdfButton.style.backgroundColor="rgb(51, 160, 160)";
    activityProjectButton.style.backgroundColor="rgb(152, 240, 247)";
    activityFilterUpdation()
});

activityProjectButton.addEventListener("click",()=>{
    activityFilter="Project";
    activityTeamButton.style.backgroundColor="rgb(152, 240, 247)";
    activityTaskButton.style.backgroundColor="rgb(152, 240, 247)";
    activityAllButton.style.backgroundColor="rgb(152, 240, 247)";
    activityPdfButton.style.backgroundColor="rgb(152, 240, 247)";
    activityProjectButton.style.backgroundColor="rgb(51, 160, 160)";
    activityFilterUpdation()
});

function activityFilterUpdation(){
    let filtered=allActivitiesForFilter;
    if(activityFilter==="Task"){
        filtered=filtered.filter((activity)=>{
            return (activity.type==="task_created" || activity.type==="task_updated" || activity.type==="task_deleted" || activity.type==="task_status_changed");
        })
    }
    if(activityFilter==="Team"){
        filtered=filtered.filter((activity)=>{
            return (activity.type==="member_invited" || activity.type==="member_removed" || activity.type==="role_changed");
        })
    }
    if(activityFilter==="Pdf"){
        filtered=filtered.filter((activity)=>{
            return (activity.type==="pdf_related");
        })
    }
    if(activityFilter==="Project"){
        filtered=filtered.filter((activity)=>{
            return (activity.type==="project_related");
        })
    }
    activityHolder.innerHTML="";
    if(filtered.length!==0){
        noActivityStateHolder.style.display="none";
        filtered.forEach((singleActivity)=>{
            const div=document.createElement("div");
            const hr=document.createElement("hr");
            div.classList.add("singleActivityHolder");
            hr.classList.add("activityHr");
            div.innerHTML=
                `<p class="activityPara">${singleActivity.message}</p>
                <p class="activityTimeline" data-created-at="${singleActivity.createdAt.toString()}">${getRelativeTime(singleActivity.createdAt.toString())}</p>`;
            activityHolder.prepend(hr);
            activityHolder.prepend(div);
        });
    }else{
        noActivityStateHolder.style.display="block";
        noActivityStateHolder.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            noActivityStateHolder.style.animation="";
        },300);
    }
}

const chatOptions=document.querySelector("#chatOptions");
const messageDisplay=document.querySelector("#messageDisplay");
const leaveMessageDisplay=document.querySelector("#leaveMessageDisplay");
const msgSendForm=document.querySelector("#msgSendForm");
const msgInput=document.querySelector("#msgInput");
const msgSendButton=document.querySelector("#msgSendButton");

async function discussionOptionReload(){
    const projectId=document.location.pathname.split("/").pop();
    const options=await fetch(`/dashboard/projects/${projectId}/discussion`,{
        method:"get"
    })
    const option=await options.json();
    chatOptions.innerHTML="";
    option.memberList.forEach((member)=>{
        if(member.member._id.toString()!==option.currUserId){
            const button=document.createElement("button");
            button.classList.add("chatButtonOption");
            button.classList.add("memberChatOption");
            button.dataset.chatType="dm";
            button.dataset.id=member.member._id.toString();
            button.dataset.name=member.member.fullName;
            button.innerHTML=
                `<i class="fa-solid fa-circle-user"></i><pre> ${member.member.fullName}</pre>`;
            chatOptions.appendChild(button);
        }
    })
    if(option.specialOption.owner._id.toString()!==option.currUserId){
        const button=document.createElement("button");
        button.classList.add("chatButtonOption");
        button.classList.add("memberChatOption");
        button.dataset.chatType="dm";
        button.dataset.id=option.specialOption.owner._id.toString();
        button.dataset.name=option.specialOption.owner.fullName;
        button.innerHTML=
            `<i class="fa-solid fa-circle-user"></i><pre> ${option.specialOption.owner.fullName}</pre>`;
        chatOptions.prepend(button);
    }
    const button=document.createElement("button");
    button.classList.add("chatButtonOption");
    button.classList.add("teamChatOption");
    button.dataset.chatType="team";
    button.dataset.id=projectId;
    button.dataset.name=option.specialOption.projectName;
    button.innerHTML=
        `<i class="fa-solid fa-people-roof"></i><pre> ${option.specialOption.projectName}</pre>`;
    chatOptions.prepend(button);
}
discussionOptionReload();

let roomId;
let receiver;
let chatType;
let msgHeading=document.querySelector("#msgHeading");
document.addEventListener("click",(e)=>{
    if(e.target.closest(".chatButtonOption")){
        const projectId=document.location.pathname.split("/").pop();
        const button=e.target.closest(".chatButtonOption");
        msgInput.focus();
        chatType=button.dataset.chatType;
        msgHeading.innerText=button.dataset.name;
        if(chatType==="team"){
            roomId=projectId;
            receiver=null;
        }else{
            roomId=createDmRoomId(projectId,currUserId,button.dataset.id);
            receiver=button.dataset.id;
        }
        socket.emit("joinRoom",roomId);
        chatOptions.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
        setTimeout(()=>{
            chatOptions.style.display="none";
            messageDisplay.style.display="block";
            messageDisplay.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
        },300);
        chatReload();

    }
})

function createDmRoomId(projectId,memberId1,memberId2){
    let users=[memberId1,memberId2];
    users.sort();
    return `${projectId}-${users[0]}-${users[1]}`;
}

leaveMessageDisplay.addEventListener("click",()=>{
    socket.emit("leaveRoom",roomId);
    messageDisplay.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        chatOptions.style.display="block";
        messageDisplay.style.display="none";
        chatOptions.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
    },300);
})

let currMsgId;
let isEdit=false;
msgSendForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectId=document.location.pathname.split("/").pop();
    let message=msgInput.value;
    if(isEdit){
        const body={
            msg:message
        }
        const msg=await fetch(`/dashboard/projects/${projectId}/chat/${currMsgId}`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        });
        isEdit=false;
        chatReload();
    }else{
        const body={
            projectId:projectId,
            roomId:roomId,
            chatType:chatType,
            sender:currUserId,
            receiver:receiver,
            message:message
        };
        socket.emit("sendMessage",body);
    }
});

const MsgHolder=document.querySelector("#MsgHolder");
socket.on("receiveMessage",(data)=>{
    const div=document.createElement("div");
    if(currUserId===data.sender._id){
        div.classList.add("ourMsgParaHolder");
        div.innerHTML=
        `<div class="singleMsgParaHolder">
            <p class="msgSenderHolder"><i class="fa-solid fa-user"></i> ${data.sender.fullName}</p>
            <p class="msgPara">${data.message}</p>
            <div class="singleMsgButtonHolder">
                <button class="singleMsgCopyButton"><i class="fa-regular fa-copy"></i></button>    
                <button class="singleMsgEditButton"><i class="fa-solid fa-pen-to-square"></i></button>    
                <button class="singleMsgDeleteButton"><i class="fa-solid fa-trash-can"></i></button>
                <div class="singleMsgButtonTimeline">
                    <p class="singleMsgButtonTime">${msgTimeline(data.createdAt)}</p>
                </div>    
            </div>
        </div>`;
    }else{
        div.classList.add("otherMsgParaHolder");
        div.innerHTML=
        `<div class="singleMsgParaHolder">
            <p class="msgSenderHolder"><i class="fa-solid fa-user"></i> ${data.sender.fullName}</p>
            <p class="msgPara">${data.message}</p>
            <div class="singleMsgButtonHolder">
                <button class="singleMsgCopyButton"><i class="fa-regular fa-copy"></i></button>
                <div class="singleMsgButtonTimeline">
                    <p class="singleMsgButtonTime">${msgTimeline(data.createdAt)}</p>
                </div>    
            </div>
        </div>`;
    }
    div.dataset.id=data._id;
    div.dataset.msg=data.message;
    MsgHolder.prepend(div);
    msgInput.value="";
})

async function chatReload(){
    const projectId=document.location.pathname.split("/").pop();
    const result=await fetch(`/dashboard/projects/${projectId}/chat/${roomId}`,{
        method:"get"
    });
    const response=await result.json();
    MsgHolder.innerHTML="";
    if(response.Messages.length!==0){
        response.Messages.forEach((message)=>{
            const div=document.createElement("div");
            div.dataset.id=message._id;
            div.dataset.msg=message.message;
            if(currUserId===message.sender._id){
                div.classList.add("ourMsgParaHolder");
                div.innerHTML=
                `<div class="singleMsgParaHolder">
                    <p class="msgSenderHolder"><i class="fa-solid fa-user"></i> ${message.sender.fullName}</p>
                    <p class="msgPara">${message.message}</p>
                    <div class="singleMsgButtonHolder">
                        <button class="singleMsgCopyButton"><i class="fa-regular fa-copy"></i></button>    
                        <button class="singleMsgEditButton"><i class="fa-solid fa-pen-to-square"></i></button>    
                        <button class="singleMsgDeleteButton"><i class="fa-solid fa-trash-can"></i></button>
                        <div class="singleMsgButtonTimeline">
                            <p class="singleMsgButtonTime">${msgTimeline(message.createdAt)}</p>
                        </div>    
                    </div>
                </div>`;
            }else{
                div.classList.add("otherMsgParaHolder");
                div.innerHTML=
                `<div class="singleMsgParaHolder">
                    <p class="msgSenderHolder"><i class="fa-solid fa-user"></i> ${message.sender.fullName}</p>
                    <p class="msgPara">${message.message}</p>
                    <div class="singleMsgButtonHolder">
                        <button class="singleMsgCopyButton"><i class="fa-regular fa-copy"></i></button>    
                        <div class="singleMsgButtonTimeline">
                            <p class="singleMsgButtonTime">${msgTimeline(message.createdAt)}</p>
                        </div>    
                    </div>
                </div>`;
            }
            MsgHolder.prepend(div);
        })
        msgInput.value="";
        MsgHolder.scrollTop=MsgHolder.scrollHeight;
    }
}

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".singleMsgDeleteButton")){
        const projectId=document.location.pathname.split("/").pop();
        let div1=e.target.closest(".ourMsgParaHolder");
        let div2=e.target.closest(".otherMsgParaHolder");
        let msgId;
        if(div1){
            msgId=div1.dataset.id;
        }else{
            msgId=div2.dataset.id;
        }
        await fetch(`/dashboard/projects/${projectId}/chat/${msgId}`,{
            method:"delete"
        });
        chatReload();
    }
})

function msgTimeline(createdAt){
    let created=new Date(createdAt);
    let now=new Date();
    let diff=now-created;
    const days=Math.floor(diff/(1000*60*60*24));
    if(days===0){
        return created.toLocaleTimeString("en-us",{
            hour:"numeric",
            minute:"2-digit",
            hour12:true
    })
    }
    if(days===1){
        return "Yesterday";
    }
    return created.toLocaleDateString(("en-IN",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    }))
}

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".singleMsgCopyButton")){
        let div1=e.target.closest(".ourMsgParaHolder");
        let div2=e.target.closest(".otherMsgParaHolder");
        let button=e.target.closest(".singleMsgCopyButton");
        let msg;
        if(div1){
            msg=div1.dataset.msg;
        }else{
            msg=div2.dataset.msg;
        }
        navigator.clipboard.writeText(msg);
        button.innerHTML='<i class="fa-solid fa-circle-check"></i>';
        setTimeout(()=>{
            button.innerHTML='<i class="fa-regular fa-copy"></i>';
        },500);
    }
})

document.addEventListener("click",(e)=>{
    if(e.target.closest(".singleMsgEditButton")){
        let div1=e.target.closest(".ourMsgParaHolder");
        let div2=e.target.closest(".otherMsgParaHolder");
        let button=e.target.closest(".singleMsgCopyButton");
        let msg;
        isEdit=true;
        if(div1){
            msgInput.value=div1.dataset.msg;
            currMsgId=div1.dataset.id;
        }else{
            msgInput.value=div2.dataset.msg;
            currMsgId=div1.dataset.id;
        }
        msgInput.focus();
    }
})

const notesNavigationHolder=document.querySelector("#notesNavigationHolder");
const personalNotesHolder=document.querySelector("#personalNotesHolder");
const personalPDFsHolder=document.querySelector("#personalPDFsHolder");
const teamPDFsHolder=document.querySelector("#teamPDFsHolder");
const personalNotesButton=document.querySelector("#personalNotesButton");
const personalPDFsButton=document.querySelector("#personalPDFsButton");
const teamPDFsButton=document.querySelector("#teamPDFsButton");

personalNotesButton.addEventListener("click",()=>{
    notesNavigationHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    personalPDFsHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    teamPDFsHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        notesNavigationHolder.style.display="none";
        personalPDFsHolder.style.display="none";
        teamPDFsHolder.style.display="none";
        personalNotesHolder.style.display="block";
        personalNotesHolder.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
    },300);
})

personalPDFsButton.addEventListener("click",()=>{
    notesNavigationHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    personalNotesHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    teamPDFsHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        notesNavigationHolder.style.display="none";
        personalPDFsHolder.style.display="block";
        teamPDFsHolder.style.display="none";
        personalNotesHolder.style.display="none";
        personalPDFsHolder.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
    },300);
})

teamPDFsButton.addEventListener("click",async (e)=>{
    const projectId=document.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/getPosition`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        if(result.position==="Member"){
            teamPdfUploadButton.style.display="none";
        }else{
            teamPdfUploadButton.style.display="flex";
        }
        notesNavigationHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
        personalPDFsHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
        personalNotesHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
        setTimeout(()=>{
            notesNavigationHolder.style.display="none";
            personalPDFsHolder.style.display="none";
            teamPDFsHolder.style.display="block";
            personalNotesHolder.style.display="none";
            teamPDFsHolder.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
        },300);
    }
})

const personalNotesGrid=document.querySelector("#personalNotesGrid");
const personalNotesForm=document.querySelector("#personalNotesForm");
const personalNotesInput=document.querySelector("#personalNotesInput");
let currNoteId;
let isNoteEdit=false

personalNotesForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const note=personalNotesInput.value;
    const projectId=document.location.pathname.split("/").pop();
    const body={
        note:note
    }
    if(isNoteEdit){
        await fetch(`/dashboard/projects/${projectId}/personalNote/${currNoteId}`,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })
        getPersonalNotes();
        isNoteEdit=false;
    }else{
        const result=await fetch(`/dashboard/projects/${projectId}/personalNote`,{
            method:"post",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })
        const response=await result.json();
        if(response.createdNote){
            noPersonalNotesStateHolder.style.display="none";
            const div=document.createElement("div");
            div.dataset.id=response.createdNote._id;
            div.dataset.note=response.createdNote.note;
            div.classList.add("singleNoteHolder");
            div.innerHTML=
                `<p class="NotePara">${response.createdNote.note}</p>
                <div class="singleNoteButtonsHolder">
                    <button class="singleNoteButton singleNoteCopyButton">Copy</button>
                    <button class="singleNoteButton singleNoteEditButton">Edit</button>
                    <button class="singleNoteButton singleNoteDeleteButton">Delete</button>
                    <div class="singleNoteTimelineHolder">
                        <p class="singleNoteTimeline">${noteTimeline(response.createdNote.note)}</p>
                    </div>
                </div>`;
            personalNotesGrid.prepend(div);
            personalNotesInput.value="";
        }
    }
})

function noteTimeline(createdAt){
    const created=new Date();
    return created.toLocaleDateString("en-IN",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    });
}

async function getPersonalNotes(){
    const projectId=document.location.pathname.split("/").pop();
    const result=await fetch(`/dashboard/projects/${projectId}/personalNote`,{
        method:"get"
    });
    const response=await result.json();
    personalNotesGrid.innerHTML="";
    if(response.msg==="success"){
        if(response.personalNotes.length!==0){
            noPersonalNotesStateHolder.style.display="none";
            response.personalNotes.forEach((note)=>{
                const div=document.createElement("div");
                div.dataset.id=note._id;
                div.dataset.note=note.note;
                div.classList.add("singleNoteHolder");
                div.innerHTML=
                    `<p class="NotePara">${note.note}</p>
                    <div class="singleNoteButtonsHolder">
                        <button class="singleNoteButton singleNoteCopyButton">Copy</button>
                        <button class="singleNoteButton singleNoteEditButton">Edit</button>
                        <button class="singleNoteButton singleNoteDeleteButton">Delete</button>
                        <div class="singleNoteTimelineHolder">
                            <p class="singleNoteTimeline">${noteTimeline(note.createdAt)}</p>
                        </div>
                    </div>`;
                personalNotesGrid.prepend(div);
                personalNotesInput.value="";
            })
        }else{
            noPersonalNotesStateHolder.style.display="block";
        }
    }
}
getPersonalNotes();

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".singleNoteDeleteButton")){
        const projectId=document.location.pathname.split("/").pop();
        const div=e.target.closest(".singleNoteHolder");
        const noteId=div.dataset.id;
        await fetch(`/dashboard/projects/${projectId}/personalNote/${noteId}`,{
            method:"delete"
        })
        getPersonalNotes();
    }
})

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".singleNoteCopyButton")){
        const div=e.target.closest(".singleNoteHolder");
        const btn=e.target.closest(".singleNoteCopyButton");
        const note=div.dataset.note;
        navigator.clipboard.writeText(note);
        btn.innerText="Done";
        setTimeout(()=>{
            btn.innerText="Copy";
        },500);
    }
})

document.addEventListener("click",async (e)=>{
    if(e.target.closest(".singleNoteEditButton")){
        const div=e.target.closest(".singleNoteHolder");
        currNoteId=div.dataset.id;
        isNoteEdit=true;
        personalNotesInput.value=div.dataset.note;
        personalNotesInput.focus();
    }
})

const personalPdfUploadButton=document.querySelector("#personalPdfUploadButton");
const pdfUploadHolder=document.querySelector("#pdfUploadHolder");
const pdfUploadPage=document.querySelector("#pdfUploadPage");
const pdfCancelButton=document.querySelector("#pdfCancelButton");
const pdfUploadForm=document.querySelector("#pdfUploadForm");
const pdfFileInput=document.querySelector("#pdfFileInput");
const pdfFileNameInput=document.querySelector("#pdfFileNameInput");
const personalPDFsGrid=document.querySelector("#personalPDFsGrid");
const pdfSubmitButton=document.querySelector("#pdfSubmitButton");
const pdfFormButtonHolder=document.querySelector("#pdfFormButtonHolder");
const teamPdfUploadButton=document.querySelector("#teamPdfUploadButton");
const teamPDFsGrid=document.querySelector("#teamPDFsGrid");
let isTeamPdf=false;

personalPdfUploadButton.addEventListener("click",()=>{
    pdfFileInput.value="";
    pdfFileNameInput.value="";
    pdfUploadHolder.style.display="flex";
    pdfUploadPage.style.animation="invitePage 0.3s linear 0s forwards";
    document.body.style.overflow="hidden";
})

teamPdfUploadButton.addEventListener("click",()=>{
    pdfFileInput.value="";
    pdfFileNameInput.value="";
    pdfUploadHolder.style.display="flex";
    pdfUploadPage.style.animation="invitePage 0.3s linear 0s forwards";
    document.body.style.overflow="hidden";
    isTeamPdf=true;
})

pdfCancelButton.addEventListener("click",()=>{
    pdfUploadPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        pdfUploadHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
})

let isPdfUploading=false;
pdfUploadForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    if(isPdfUploading){
        return;
    }
    const projectId=document.location.pathname.split("/").pop();
    const file=pdfFileInput.files[0];
    const fileName=pdfFileNameInput.value;
    const formData=new FormData();

    isPdfUploading=true;
    pdfSubmitButton.style.display="none";
    pdfCancelButton.innerText="Uploading...";
    pdfCancelButton.disabled=true;
    pdfFormButtonHolder.style.justifyContent="center";

    formData.append("pdf",file);
    formData.append("fileName",fileName);
    let response;
    if(isTeamPdf){
        response=await fetch(`/dashboard/projects/${projectId}/teamPdf`,{
            method:"post",
            body:formData
        })
    }else{
        response=await fetch(`/dashboard/projects/${projectId}/pdf`,{
            method:"post",
            body:formData
        })
    }
    const result=await response.json();
    if(result.msg==="success"){
        pdfSubmitButton.style.display="flex";
        pdfCancelButton.innerText="Cancel";
        pdfCancelButton.disabled=false;
        pdfFormButtonHolder.style.justifyContent="space-around";

        pdfUploadPage.style.animation="cancelPage 0.3s linear 0s forwards";
        setTimeout(()=>{
            pdfUploadHolder.style.display="none";
            document.body.style.overflow="auto";
        },300);
        const button=document.createElement("button");
        button.classList.add("personalPDFButton");
        button.dataset.url=result.createdPdf.fileUrl;
        button.dataset.id=result.createdPdf._id;
        if(isTeamPdf){
            activityReload();
            button.innerHTML=
                `<div class="personalPDFIcon">
                    <i>PDF</i>
                </div>
                <div class="personalPDFName">
                     <div class="senderNameHolder">
                        <p class="senderName">${result.createdPdf.sender.fullName}</p>
                    </div>
                <div class="personalPDFName">
                    <p class="personalPDFNamePara">${result.createdPdf.pdfName}</p>
                </div>`;
            teamPDFsGrid.prepend(button);
            noTeamPdfStateHolder.style.display="none";
            isTeamPdf=false;
        }else{
            button.innerHTML=
                `<div class="personalPDFIcon">
                    <i>PDF</i>
                </div>
                <div class="personalPDFName"><p class="personalPDFNamePara">${result.createdPdf.pdfName}</p></div>`;
            noPersonalPdfStateHolder.style.display="none";
            personalPDFsGrid.prepend(button);
        }
    }
    isPdfUploading=false;
});

let clickTimer;
document.addEventListener("click",(e)=>{
    if(e.target.closest(".personalPDFButton")){
        const button=e.target.closest(".personalPDFButton");
        if(!button) return;
        clearTimeout(clickTimer);
        clickTimer=setTimeout(()=>{
            const url=button.dataset.url;
            window.open(url,"_blank");
        },250);
    }
})

const pdfSettingPageForm=document.querySelector("#pdfSettingPageForm");
const pdfSettingPageHolder=document.querySelector("#pdfSettingPageHolder");
const pdfSettingPage=document.querySelector("#pdfSettingPage");
const pdfSettingCloseButton=document.querySelector("#pdfSettingCloseButton");
const pdfSettingNameInput=document.querySelector("#pdfSettingNameInput");
const pdfSettingDeleteButton=document.querySelector("#pdfSettingDeleteButton");

let currUserPosition;
let currPdfScope;
let currPdfId;
document.addEventListener("dblclick",async (e)=>{
    if(e.target.closest(".personalPDFButton")){
        const button=e.target.closest(".personalPDFButton");
        if(!button) return;
        clearTimeout(clickTimer);
        const projectId=document.location.pathname.split("/").pop();
        const pdfId=button.dataset.id;
        const response=await fetch(`/dashboard/projects/${projectId}/${pdfId}/getPdfName`,{
            method:"get"
        });
        const result=await response.json();
        if(result.msg==="success"){
            currUserPosition=result.position;
            currPdfScope=result.scope;
            currPdfId=button.dataset.id;
            if(result.position==="Member" && result.scope==="team"){
                const url=button.dataset.url;
                window.open(url,"_blank");
                return;
            }else{
                pdfSettingNameInput.value=`${result.name}`;
                pdfSettingPageHolder.style.display="flex";
                pdfSettingPage.style.animation="invitePage 0.3s linear 0s forwards";
            }
        }
    }
})
pdfSettingCloseButton.addEventListener("click",()=>{
    pdfSettingPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        pdfSettingPageHolder.style.display="none";
    },300);
})

const pdfSettingEditPageComment=document.querySelector("#pdfSettingEditPageComment");
pdfSettingPageForm.addEventListener("submit",async (e)=>{
    if(isDeleteProcess){
        return;
    }
    e.preventDefault();
    const projectId=document.location.pathname.split("/").pop();
    const pdfId=currPdfId;
    let response;
    const body={
        name:pdfSettingNameInput.value
    }
    if(currPdfScope==="team"){
        response=await fetch(`/dashboard/projects/${projectId}/${pdfId}/editTeamPdf`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(body)
        });
    }else{
        response=await fetch(`/dashboard/projects/${projectId}/${pdfId}/editPersonalPdf`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(body)
        });
    }
    const result=await response.json();
    if(result.msg==="success"){
        pdfSettingEditPageComment.innerText="Edit Successfully";
        pdfSettingEditPageComment.style.display="flex";
        pdfSettingEditPageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            pdfSettingEditPageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            setTimeout(()=>{
                pdfSettingEditPageComment.style.display="none";
                pdfSettingPage.style.animation="cancelPage 0.3s linear 0s forwards";
                setTimeout(()=>{
                    pdfSettingPageHolder.style.display="none";
                },300);
            })
        },1300);
        PdfReload();
        activityReload();
    }
})
const pdfSettingEditButton=document.querySelector("#pdfSettingEditButton");
const pdfSettingButtonHolder=document.querySelector("#pdfSettingButtonHolder");
let isDeleteProcess=false;
pdfSettingDeleteButton.addEventListener("click",async (e)=>{
    if(isDeleteProcess){
        return;
    }
    pdfSettingEditButton.style.display="none";
    pdfSettingEditButton.disabled=true;
    pdfSettingCloseButton.disabled=true;
    pdfSettingCloseButton.innerText="Wait for process";
    pdfSettingButtonHolder.style.justifyContent="center";
    const projectId=document.location.pathname.split("/").pop();
    const pdfId=currPdfId;
    let response;
    isDeleteProcess=true;
    if(currPdfScope==="team"){
        response=await fetch(`/dashboard/projects/${projectId}/${pdfId}/deleteTeamPdf`,{
            method:"delete"
        });
    }else{
        response=await fetch(`/dashboard/projects/${projectId}/${pdfId}/deletePersonalPdf`,{
            method:"delete"
        });
    }
    const result=await response.json();
    if(result.msg==="success"){
        pdfSettingEditPageComment.innerText="Deleted Successfully";
        pdfSettingEditPageComment.style.display="flex";
        pdfSettingEditPageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            pdfSettingEditPageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            setTimeout(()=>{
                pdfSettingEditPageComment.style.display="none";
                pdfSettingPage.style.animation="cancelPage 0.3s linear 0s forwards";
                setTimeout(()=>{
                    pdfSettingPageHolder.style.display="none";
                    isDeleteProcess=false;
                    pdfSettingEditButton.style.display="flex";
                    pdfSettingEditButton.disabled=false;
                    pdfSettingCloseButton.disabled=false;
                    pdfSettingCloseButton.innerText="Close";
                    pdfSettingButtonHolder.style.justifyContent="space-around";
                },300);
            })
        },1300);
        PdfReload();
        activityReload();
    }
})

async function PdfReload(){
    const projectId=document.location.pathname.split("/").pop();
    const result=await fetch(`/dashboard/projects/${projectId}/pdf`,{
        method:"GET"
    });
    const response=await result.json();
    teamPDFsGrid.innerHTML="";
    personalPDFsGrid.innerHTML="";
    if(response.msg==="success"){
        if(response.pdfs.length!==0){
            noPersonalPdfStateHolder.style.display="none";
            response.pdfs.forEach((pdf)=>{
                const button=document.createElement("button");
                button.classList.add("personalPDFButton");
                button.dataset.url=pdf.fileUrl;
                button.dataset.id=pdf._id;
                button.innerHTML=
                    `<div class="personalPDFIcon">
                        <i>PDF</i>
                    </div>
                    <div class="personalPDFName"><p class="personalPDFNamePara">${pdf.pdfName}</p></div>`;
                personalPDFsGrid.prepend(button);
            })
        }else{
            noPersonalPdfStateHolder.style.display="block";
        }
        if(response.teamPdfs.length!==0){
            noTeamPdfStateHolder.style.display="none";
            response.teamPdfs.forEach((pdf)=>{
                const button=document.createElement("button");
                button.classList.add("personalPDFButton");
                button.dataset.url=pdf.fileUrl;
                button.dataset.id=pdf._id;
                button.innerHTML=
                    `<div class="personalPDFIcon">
                        <i>PDF</i>
                    </div>
                    <div class="personalPDFName">
                         <div class="senderNameHolder">
                            <p class="senderName">${pdf.sender.fullName}</p>
                        </div>
                    <div class="personalPDFName">
                        <p class="personalPDFNamePara">${pdf.pdfName}</p>
                    </div>`;
                teamPDFsGrid.prepend(button);
            })
            if(response.position==="Member"){
                teamPdfUploadButton.style.display="none";
            }
        }else{
            noTeamPdfStateHolder.style.display="block";
        }
    }
}
PdfReload();

const personalNotesLeaveButton=document.querySelector("#personalNotesLeaveButton");
const personalPdfLeaveButton=document.querySelector("#personalPdfLeaveButton");
const teamPdfLeaveButton=document.querySelector("#teamPdfLeaveButton");

personalNotesLeaveButton.addEventListener("click",()=>{
    personalNotesHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        notesNavigationHolder.style.display="block";
        personalNotesHolder.style.display="none";
        notesNavigationHolder.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
    },300);
})

personalPdfLeaveButton.addEventListener("click",()=>{
    personalPDFsHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        notesNavigationHolder.style.display="block";
        personalPDFsHolder.style.display="none";
        notesNavigationHolder.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
    },300);
})

teamPdfLeaveButton.addEventListener("click",()=>{
    teamPDFsHolder.style.animation="chatScreenOfAnimation 0.3s linear 0s forwards";
    setTimeout(()=>{
        notesNavigationHolder.style.display="block";
        teamPDFsHolder.style.display="none";
        notesNavigationHolder.style.animation="chatScreenOnAnimation 0.3s linear 0s forwards";
    },300);
})

const backToDashboard=document.querySelector("#backToDashboard");

backToDashboard.addEventListener("click",()=>{
    location.replace("/dashboard");
})

const projectSetting=document.querySelector("#projectSetting");
const projectSettingCloseButton=document.querySelector("#projectSettingCloseButton");

const projectSettingPageHolder=document.querySelector("#projectSettingPageHolder");
const projectSettingPage=document.querySelector("#projectSettingPage");

const projectSettingNameHolder=document.querySelector("#projectSettingNameHolder");
const projectSettingDescriptionHolder=document.querySelector("#projectSettingDescriptionHolder");
const projectSettingOwnerNameHolder=document.querySelector("#projectSettingOwnerNameHolder");
const projectSettingDeadlineHolder=document.querySelector("#projectSettingDeadlineHolder");
const projectSettingStatusHolder=document.querySelector("#projectSettingStatusHolder");

const projectSettingEditPageProjectNameInput=document.querySelector("#projectSettingEditPageProjectNameInput");
const projectSettingEditPageDeadlineInput=document.querySelector("#projectSettingEditPageDeadlineInput");
const projectSettingEditPageDescriptionHolder=document.querySelector("#projectSettingEditPageDescriptionHolder");

const projectSettingOptions=document.querySelector("#projectSettingOptions");
const projectSettingButtonHolder=document.querySelector("#projectSettingButtonHolder");

let currProjectName;
let currProjectDeadline;
let currProjectDescription;

const projectSettingMemberOption=document.querySelector("#projectSettingMemberOption");

projectSetting.addEventListener("click",async ()=>{
    const projectId=document.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/projectInfo`,{
        method:"get"
    });
    const result=await response.json();
    if(result.msg==="success"){
        console.log(result.position);
        if(result.position==="Member"){
            projectSettingMemberOption.style.display="";
            projectSettingOptions.style.display="none";
            projectSettingEditButton.style.display="none";
            projectSettingButtonHolder.style.justifyContent="center";
        }else if(result.position==="Admin"){
            projectSettingMemberOption.style.display="";
            projectSettingOptions.style.display="none";
            projectSettingEditButton.style.display="flex";
            projectSettingButtonHolder.style.justifyContent="space-around";
        }else{
            projectSettingMemberOption.style.display="none";
            projectSettingOptions.style.display="";
            projectSettingEditButton.style.display="flex";
            projectSettingButtonHolder.style.justifyContent="space-around";
        }
        document.body.style.overflow="hidden";
        projectSettingNameHolder.innerText=`${result.project.projectName}`;
        projectSettingDescriptionHolder.innerText=`${result.project.description}`;
        projectSettingOwnerNameHolder.innerText=`${result.project.owner.fullName}`;
        projectSettingDeadlineHolder.innerText=`${dateCreater(result.project.deadline)}`;
        projectSettingStatusHolder.innerText=`${result.project.status}`;
        projectSettingPageHolder.style.display="flex";
        projectSettingPage.style.animation="invitePage 0.3s linear 0s forwards";
        currProjectName=result.project.projectName;
        currProjectDeadline=correctDateCreator(result.project.deadline);
        currProjectDescription=result.project.description;
    }
})

projectSettingCloseButton.addEventListener("click",()=>{
    projectSettingPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        document.body.style.overflow="auto";
        projectSettingPageHolder.style.display="none";
    },300);
})

const projectSettingEditButton=document.querySelector("#projectSettingEditButton");
const projectSettingEditPageCancelButton=document.querySelector("#projectSettingEditPageCancelButton");
const projectSettingEditPage=document.querySelector("#projectSettingEditPage");

projectSettingEditButton.addEventListener("click",()=>{
    projectSettingEditPageProjectNameInput.value=currProjectName;
    projectSettingEditPageDeadlineInput.value=currProjectDeadline;
    projectSettingEditPageDescriptionHolder.value=currProjectDescription;
    projectSettingPage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingPage.style.display="none";
        projectSettingEditPage.style.display="block";
        projectSettingEditPage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})
projectSettingEditPageCancelButton.addEventListener("click",()=>{
    projectSettingEditPage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingEditPage.style.display="none";
        projectSettingPage.style.display="block";
        projectSettingPage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})

const projectSettingEditPageComment=document.querySelector("#projectSettingEditPageComment");
const taskSettingEditPageForm=document.querySelector("#taskSettingEditPageForm");
taskSettingEditPageForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectId=document.location.pathname.split("/").pop();
    const body={
        projectName:projectSettingEditPageProjectNameInput.value,
        deadline:projectSettingEditPageDeadlineInput.value,
        description:projectSettingEditPageDescriptionHolder.value
    };
    const response=await fetch(`/dashboard/projects/${projectId}/projectUpdate`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        projectSettingEditPageComment.innerText="Edit Successfully";
        projectSettingEditPageComment.style.display="flex";
        projectSettingEditPageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            projectSettingEditPageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            setTimeout(()=>{
                projectSettingEditPageComment.style.display="none";
                currProjectName=result.project.projectName;
                currProjectDeadline=correctDateCreator(result.project.deadline);
                currProjectDescription=result.project.description;
                projectSettingNameHolder.innerText=`${result.project.projectName}`;
                projectSettingDescriptionHolder.innerText=`${result.project.description}`;
                projectSettingDeadlineHolder.innerText=`${dateCreater(result.project.deadline)}`;
                projectSettingEditPage.style.animation="page1Flip 0.3s linear 0s forwards";
                setTimeout(()=>{
                    projectSettingEditPage.style.display="none";
                    projectSettingPage.style.display="block";
                    projectSettingPage.style.animation="page2Flip 0.3s linear 0s forwards";
                },300);
                activityReload();
            },400);
        },1500);
    }
})

function correctDateCreator(deadline){
    const date=new Date(deadline);
    const year=date.getFullYear();
    const month=String(date.getMonth()+1).padStart(2,"0");
    const day=String(date.getDate()).padStart(2,"0");
    return `${year}-${month}-${day}`;
}

const projectSettingEditStatusButton=document.querySelector("#projectSettingEditStatusButton");
const projectSettingTransferOwnershipButton=document.querySelector("#projectSettingTransferOwnershipButton");
const projectSettingDeleteProjectButton=document.querySelector("#projectSettingDeleteProjectButton");
const projectSettingEditStatusCancelButton=document.querySelector("#projectSettingEditStatusCancelButton");
const projectSettingDeletePageCancelButton=document.querySelector("#projectSettingDeletePageCancelButton");

const projectSettingEditStatusPage=document.querySelector("#projectSettingEditStatusPage");
const projectSettingDeletePage=document.querySelector("#projectSettingDeletePage");
const projectSettingStatusForm=document.querySelector("#projectSettingStatusForm");

projectSettingEditStatusButton.addEventListener("click",()=>{
    projectSettingPage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingPage.style.display="none";
        projectSettingEditStatusPage.style.display="block";
        projectSettingEditStatusPage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})

projectSettingDeleteProjectButton.addEventListener("click",()=>{
    projectSettingPage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingPage.style.display="none";
        projectSettingDeletePage.style.display="block";
        projectSettingDeletePage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})

projectSettingDeletePageCancelButton.addEventListener("click",()=>{
    projectSettingDeletePage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingDeletePage.style.display="none";
        projectSettingPage.style.display="block";
        projectSettingPage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})

projectSettingEditStatusCancelButton.addEventListener("click",()=>{
    projectSettingEditStatusPage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingEditStatusPage.style.display="none";
        projectSettingPage.style.display="block";
        projectSettingPage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})

const projectSettingEditStatusPageComment=document.querySelector("#projectSettingEditStatusPageComment");
projectSettingStatusForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectSettingStatusInput=document.querySelector('input[name="projectNewStatus"]:checked');
    const projectId=document.location.pathname.split("/").pop();
    const body={
        status:projectSettingStatusInput.value
    }
    const response=await fetch(`/dashboard/projects/${projectId}/updateProjectStatus`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        projectSettingEditStatusPageComment.innerText="Change Successfully";
        projectSettingEditStatusPageComment.style.display="flex";
        projectSettingEditStatusPageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            projectSettingEditStatusPageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            setTimeout(()=>{
                projectSettingStatusHolder.innerText=`${result.status}`;
                projectSettingEditStatusPage.style.animation="page1Flip 0.3s linear 0s forwards";
                setTimeout(()=>{
                    projectSettingEditStatusPage.style.display="none";
                    projectSettingPage.style.display="block";
                    projectSettingPage.style.animation="page2Flip 0.3s linear 0s forwards";
                },300);
                activityReload();
            },400);
        },1500);
    }
})

const projectSettingDeletePageDeleteButton=document.querySelector("#projectSettingDeletePageDeleteButton");
const projectSettingDeletePageComment=document.querySelector("#projectSettingDeletePageComment");
projectSettingDeletePageDeleteButton.addEventListener("click",async ()=>{
    const projectId=document.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/deleteProject`,{
        method:"delete"
    });
    const result=await response.json();
    if(result.msg==="success"){
        projectSettingDeletePageComment.innerText="Deleted Successfully";
        projectSettingDeletePageComment.style.display="flex";
        projectSettingDeletePageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            projectSettingDeletePageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            setTimeout(()=>{
                location.replace("/dashboard");
            },400);
        },1500);
    }
})

const projectSettingTransferOwnershipForm=document.querySelector("#projectSettingTransferOwnershipForm");
const projectSettingTransferOwnershipPage=document.querySelector("#projectSettingTransferOwnershipPage");
const projectSettingTransferOwnershipSelection=document.querySelector("#projectSettingTransferOwnershipSelection");
const projectSettingTransferOwnershipCancelButton=document.querySelector("#projectSettingTransferOwnershipCancelButton");
let projectSettingTeamMembers=false;
projectSettingTransferOwnershipButton.addEventListener("click",async ()=>{
    const projectId=document.location.pathname.split("/").pop();
    const response=await fetch(`/dashboard/projects/${projectId}/task/names`,{
        method:"get"
    });
    const result=await response.json();
    projectSettingTransferOwnershipSelection.innerHTML="";
    if(result.msg==="success"){
        if(result.names.length===0){
            projectSettingTeamMembers=true;
            const option=document.createElement("option");
            option.innerText="No Team Member";
            projectSettingTransferOwnershipSelection.appendChild(option);
        }else{
            projectSettingTeamMembers=false;
            result.names.forEach((name)=>{
                const option=document.createElement("option");
                option.innerText=`${name.member.fullName}`;
                option.value=`${name.member._id}`;
                projectSettingTransferOwnershipSelection.appendChild(option);
            })
        }
        projectSettingPage.style.animation="page1Flip 0.3s linear 0s forwards";
        setTimeout(()=>{
            projectSettingPage.style.display="none";
            projectSettingTransferOwnershipPage.style.display="block";
            projectSettingTransferOwnershipPage.style.animation="page2Flip 0.3s linear 0s forwards";
        },300);
    }
})
projectSettingTransferOwnershipCancelButton.addEventListener("click",()=>{
    projectSettingTransferOwnershipPage.style.animation="page1Flip 0.3s linear 0s forwards";
    setTimeout(()=>{
        projectSettingTransferOwnershipPage.style.display="none";
        projectSettingPage.style.display="block";
        projectSettingPage.style.animation="page2Flip 0.3s linear 0s forwards";
    },300);
})
const projectSettingTransferOwnershipPageComment=document.querySelector("#projectSettingTransferOwnershipPageComment");
const projectSettingTransferPageSpacialityInput=document.querySelector("#projectSettingTransferPageSpacialityInput");
projectSettingTransferOwnershipForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    if(projectSettingTeamMembers){
        projectSettingTransferOwnershipPageComment.innerText="There are no members.";
        projectSettingTransferOwnershipPageComment.style.display="flex";
        projectSettingTransferOwnershipPageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            projectSettingTransferOwnershipPageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            projectSettingTransferOwnershipPageComment.style.display="none";
            return;
        },1300);
    }
    const projectSettingOwnerNewPositionInput=document.querySelector('input[name="ownerNewPosition"]:checked');
    const body={
        member:projectSettingTransferOwnershipSelection.value,
        newPosition:projectSettingOwnerNewPositionInput.value,
        spaciality:projectSettingTransferPageSpacialityInput.value
    };
    const response=await fetch(`/dashboard/projects/${projectId}/transferOwnership`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });
    const result=await response.json();
    if(result.msg==="success"){
        projectSettingTransferOwnershipPageComment.innerText="Transfer Seuccessfully";
        projectSettingTransferOwnershipPageComment.style.display="flex";
        projectSettingTransferOwnershipPageComment.style.animation="emptyCommentShow 0.3s linear 0s forwards";
        setTimeout(()=>{
            projectSettingTransferOwnershipPageComment.style.animation="emptyCommentHide 0.3s linear 0s forwards";
            projectSettingTransferOwnershipPageComment.style.display="none";
            projectSettingTransferOwnershipPage.style.animation="cancelPage 0.3s linear 0s forwards";
            setTimeout(()=>{
                document.body.style.overflow="auto";
                projectSettingPageHolder.style.display="none";
                projectSettingPage.style.display="block";
                projectSettingPage.style.rotateY="0deg";
                projectSettingTransferOwnershipPage.style.rotateY="90deg";
                projectSettingTransferOwnershipPage.style.display="none";
                projectSettingTransferOwnershipPage.style.scale="1";
            },300);
        },1300);
        activityReload();
    }
})

const projectSettingLeaveTeamButton=document.querySelector("#projectSettingLeaveTeamButton");
const projectSettingPageLeaveTeamComment=document.querySelector("#projectSettingPageLeaveTeamComment");
let isLeavingProcess=false;

projectSettingLeaveTeamButton.addEventListener("click",async ()=>{
    const projectId=document.location.pathname.split("/").pop();
    if(isLeavingProcess){
        return;
    }
    isLeavingProcess=true;
    projectSettingEditButton.style.display="none";
    projectSettingEditButton.disabled=true;
    projectSettingCloseButton.disabled=true;
    projectSettingCloseButton.innerText="Wait for process";
    projectSettingButtonHolder.style.justifyContent="center";
    const response=await fetch(`/dashboard/projects/${projectId}/leaveTeam`,{
        method:"delete"
    });
    const result=await response.json();
    if(result.msg==="success"){
        location.replace("/dashboard");
    }
})