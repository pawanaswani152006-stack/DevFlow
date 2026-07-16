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
    activityReload();
    discussionOptionReload();
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
        activityReload();
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
        activityReload();
        updatePage();
        discussionOptionReload();
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
    activityReload();
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
            <button class="singleTaskButton taskStatusButton">Status</button>
            <button class="singleTaskButton taskEditsButton">Edit</button>
            <button class="singleTaskButton taskDeleteButton">Delete</button>
        </div>`;
    assignedTasks.appendChild(div);
    taskAssignmentPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        taskAssignmentPageHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
    filterTask="All";
    taskUpdation();
    document.addEventListener("click",async (e)=>{
        if(e.target.classList.contains("taskStatusButton")){
            const row=e.target.closest(".singleTaskHolder");
            const taskId=row.dataset.taskId;
            currTaskId=row.dataset.taskId;
            const currStatus=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                method:"get"
            });
            const nonEditStatus=await currStatus.json();
            currStatusAns.innerText=`  ${nonEditStatus.currStatus}`;
            taskStatusPageHolder.style.display="flex";
            taskStatusUpdatePage.style.animation="invitePage 0.3s linear 0s forwards";
            document.body.style.overflow="hidden";
        }
    })
    document.addEventListener("click",async (e)=>{
        if(e.target.classList.contains("taskEditsButton")){
            const row=e.target.closest(".singleTaskHolder");
            const taskId=row.dataset.taskId;
            currTaskId=row.dataset.taskId;
            const result=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                method:"get"
            });
            const response=await result.json();
            taskEditPageHolder.style.display="flex";
            taskEditPage.style.animation="invitePage 0.3s linear 0s forwards";
            document.body.style.overflow="hidden";
            taskEditInput.value=response.task.task;
            taskEditDate.value=response.task.deadline.split("T")[0];
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
        }
    })
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
    filteredTasks=allTasks.allTasks;
    currentUser=allTasks.user.fullName;
    currUserId=allTasks.user._id.toString();
    currUserRole=allTasks.userRole;
    assignedTasks.innerHTML="";
    if(allTasks.allTasks.length===0){
        return;
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
    assignedTasks.appendChild(div);
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
    document.addEventListener("click",async (e)=>{
        if(e.target.classList.contains("taskStatusButton")){
            const row=e.target.closest(".singleTaskHolder");
            const taskId=row.dataset.taskId;
            currTaskId=row.dataset.taskId;
            const currStatus=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                method:"get"
            });
            const nonEditStatus=await currStatus.json();
            currStatusAns.innerText=`  ${nonEditStatus.currStatus}`;
            taskStatusPageHolder.style.display="flex";
            taskStatusUpdatePage.style.animation="invitePage 0.3s linear 0s forwards";
            document.body.style.overflow="hidden";
        }
    })
    document.addEventListener("click",async (e)=>{
        if(e.target.classList.contains("taskEditsButton")){
            const row=e.target.closest(".singleTaskHolder");
            const taskId=row.dataset.taskId;
            currTaskId=row.dataset.taskId;
            const result=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                method:"get"
            });
            const response=await result.json();
            taskEditPageHolder.style.display="flex";
            taskEditPage.style.animation="invitePage 0.3s linear 0s forwards";
            document.body.style.overflow="hidden";
            taskEditInput.value=response.task.task;
            taskEditDate.value=response.task.deadline.split("T")[0];
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
        }
    })
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
                    <button class="singleTaskButton taskEditsButton">Edit</button>
                    <button class="singleTaskButton taskDeleteButton">Delete</button>
                </div>`;
            }
            assignedTasks.appendChild(div);
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
        const projectId=window.location.pathname.split("/").pop();
        document.addEventListener("click",async (e)=>{
            if(e.target.classList.contains("taskDeleteButton")){
                const row=e.target.closest(".singleTaskHolder");
                const taskId=row.dataset.taskId;
                await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                    method:"delete"
                });
                filteredTasks=filteredTasks.filter((task)=>{
                    return task._id!==taskId;
                })
                taskUpdation();
                activityReload();
            }
        })
        document.addEventListener("click",async (e)=>{
            if(e.target.classList.contains("taskStatusButton")){
                const row=e.target.closest(".singleTaskHolder");
                const taskId=row.dataset.taskId;
                currTaskId=row.dataset.taskId;
                const currStatus=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                    method:"get"
                });
                const nonEditStatus=await currStatus.json();
                currStatusAns.innerText=`  ${nonEditStatus.currStatus}`;
                taskStatusPageHolder.style.display="flex";
                taskStatusUpdatePage.style.animation="invitePage 0.3s linear 0s forwards";
                document.body.style.overflow="hidden";
            }
        })
        document.addEventListener("click",async (e)=>{
            if(e.target.classList.contains("taskEditsButton")){
                const row=e.target.closest(".singleTaskHolder");
                const taskId=row.dataset.taskId;
                currTaskId=row.dataset.taskId;
                const result=await fetch(`/dashboard/projects/${projectId}/task/${taskId}`,{
                    method:"get"
                });
                const response=await result.json();
                taskEditPageHolder.style.display="flex";
                taskEditPage.style.animation="invitePage 0.3s linear 0s forwards";
                document.body.style.overflow="hidden";
                taskEditInput.value=response.task.task;
                taskEditDate.value=response.task.deadline.split("T")[0];
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
        }
    })
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
    const result=editStatus.json();
    console.log("hello bro");
    taskStatusUpdatePage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        taskStatusPageHolder.style.display="none";
        document.body.style.overflow="auto";
        taskReload();
        activityReload();
    },300);
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
        allActivitiesForFilter=allActivities.activity;
        activityHolder.innerHTML="";
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
let activityFilter="All";

activityAllButton.addEventListener("click",()=>{
    activityFilter="All";
    activityFilterUpdation()
});

activityTaskButton.addEventListener("click",()=>{
    activityFilter="Task";
    activityFilterUpdation()
});

activityTeamButton.addEventListener("click",()=>{
    activityFilter="Team";
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
    activityHolder.innerHTML="";
    if(filtered.length!==0){
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
        setTimeout(()=>{
            requestAnimationFrame(()=>{
                console.log(MsgHolder.scrollHeight);
                console.log(MsgHolder.clientHeight);
                MsgHolder.scrollTop=MsgHolder.scrollHeight;
            })
        },300);

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

teamPDFsButton.addEventListener("click",()=>{
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
    pdfUploadHolder.style.display="flex";
    pdfUploadPage.style.animation="invitePage 0.3s linear 0s forwards";
    document.body.style.overflow="hidden";
})

teamPdfUploadButton.addEventListener("click",()=>{
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

pdfUploadForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const projectId=document.location.pathname.split("/").pop();
    const file=pdfFileInput.files[0];
    const fileName=pdfFileNameInput.value;
    const formData=new FormData();

    pdfSubmitButton.style.display="none";
    pdfCancelButton.innerText="Uploading...";
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

    pdfSubmitButton.style.display="flex";
    pdfCancelButton.innerText="Cancel";
    pdfFormButtonHolder.style.justifyContent="space-around";

    pdfUploadPage.style.animation="cancelPage 0.3s linear 0s forwards";
    setTimeout(()=>{
        pdfUploadHolder.style.display="none";
        document.body.style.overflow="auto";
    },300);
    const button=document.createElement("button");
    button.classList.add("personalPDFButton");
    button.dataset.url=result.createdPdf.fileUrl;
    button.innerHTML=
        `<div class="personalPDFIcon">
            <i>PDF</i>
        </div>
        <div class="personalPDFName"><p class="personalPDFNamePara">${result.createdPdf.pdfName}</p></div>`;
    if(isTeamPdf){
        teamPDFsGrid.prepend(button);
        isTeamPdf=false;
    }else{
        personalPDFsGrid.prepend(button);
    }
});

document.addEventListener("click",(e)=>{
    if(e.target.closest(".personalPDFButton")){
        const button=e.target.closest(".personalPDFButton");
        const url=button.dataset.url;
        window.open(url,"_blank");
    }
})

async function PdfReload(){
    const projectId=document.location.pathname.split("/").pop();
    const result=await fetch(`/dashboard/projects/${projectId}/pdf`,{
        method:"GET"
    });
    const response=await result.json();
    if(response.msg==="success"){
        if(response.pdfs.length!==0){
            console.log("nhi yha per");
            response.pdfs.forEach((pdf)=>{
                const button=document.createElement("button");
                button.classList.add("personalPDFButton");
                button.dataset.url=pdf.fileUrl;
                button.innerHTML=
                    `<div class="personalPDFIcon">
                        <i>PDF</i>
                    </div>
                    <div class="personalPDFName"><p class="personalPDFNamePara">${pdf.pdfName}</p></div>`;
                personalPDFsGrid.prepend(button);
            })
        }
        if(response.teamPdfs.length!==0){
            response.teamPdfs.forEach((pdf)=>{
                const button=document.createElement("button");
                button.classList.add("personalPDFButton");
                button.dataset.url=pdf.fileUrl;
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
            console.log(response);
            if(response.position==="Member"){
                teamPdfUploadButton.style.display="none";
            }
        }
    }
}
PdfReload();