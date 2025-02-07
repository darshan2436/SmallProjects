let title = document.querySelector("#title");
let task = document.querySelector("#task");
let date = document.querySelector("#date");
let addTaskBtn = document.querySelector("#addtask");
let addListBtn = document.querySelector("#addlist");
let todo = document.querySelector(".todo");
let listArr ;

if(localStorage.getItem("list") === null){
    listArr = [];
}
else{
    listArr = JSON.parse(localStorage.getItem("list"));
    displayList(listArr);
}

let listInput = [];
let taskNo = 0;
let id;
let isDeadline = false;

function addTask(e){
    e.preventDefault();
    if(title.value === ""){
        alert("first add the Title");
        return;
    }
    let tasks = {task : task.value,id : title.value + taskNo, isChecked:false};
    if(tasks.task === "" || tasks.task === null){
        alert("The task field is empty");
        return;
    }
    listInput.push(tasks);
    taskNo++;
    task.value = "";
    showList(listInput);
    document.querySelector("#addlist").style.display = "block";
}

addTaskBtn.addEventListener("click",addTask);

addListBtn.addEventListener("click",(e)=>{
    const tasks = task.value;
    if(taskNo === 0){
        alert("no task inserted");
        return;
    }
    if(tasks !== "" || tasks !== null){
        addTask(e);
    }
    e.preventDefault();
    const deadline = date.value;
    if(deadline !== ""){
        isDeadline = true;
    }
    const titleValue = title.value;
    const list = {
        isDeadline:isDeadline,
        deadline:deadline,
        title: titleValue,
        taskNumber:taskNo,
        task : listInput
    }
    listArr.push(list);
    localStorage.setItem("list",JSON.stringify(listArr));
    displayList(listArr);
    listInput = [];
    taskNo = 0;
    title.value = "";
    document.querySelector(".container form").style.visibility= "hidden";
    location.reload();
})

function displayList(listArr){
    todo.innerHTML = "";
    listArr.forEach((list,index) => {
        let date = new Date();
        let id;
        let content = `
        <div class="${index}">
        <h1>${list.title}<i class="fa-solid fa-trash" id="${index}"></i>&nbsp&nbsp<span class="${list.isDeadline ? 'show': 'hide'}">Deadline:
        ${list.deadline}</span></h1>
        <ol>`
        for(i=0;i<list.taskNumber;i++){
            let isListChecked = list.task[i].isChecked;
            id = list.title + i;
            content += `
            <li>${isListChecked ? '<strike>':'<span>'}<input type="checkbox" id="${id}" ${isListChecked ? 'checked': ''}>${list.task[i].task}
            ${isListChecked ? '</strike>':'</span>'}
            </li>
            `
        }
        content += `</ol></div>`;
        todo.innerHTML += content;
    });

    let deleteBtns = document.querySelectorAll(".fa-trash");
    deleteBtns.forEach((deleteBtn)=>{
        deleteBtn.addEventListener("click",()=>{
            listArr = JSON.parse(localStorage.getItem("list"));
            let userConfirmed = confirm(`Are you sure you want to delete the task: ${listArr[deleteBtn.id].title}`);
            if(userConfirmed){
                if(listArr){
                    listArr.splice(deleteBtn.id,1);
                    localStorage.setItem("list",JSON.stringify(listArr));
                    location.reload();
                }
            }
        })
    })
}

let checkbox = document.querySelectorAll("li input[type='checkbox']");

checkbox.forEach((check)=>{
    check.addEventListener("change",()=>{
        listArr = JSON.parse(localStorage.getItem("list"));
        listArr.forEach((list)=>{
            for(i=0;i<list.taskNumber;i++){
                    if(check.id === list.task[i].id){
                        list.task[i].isChecked = check.checked;
                    }
            }
        })
        localStorage.setItem("list",JSON.stringify(listArr));
        location.reload();
    })
})

let listValue = document.querySelector(".values");
function showList(lists){
    listValue.innerHTML = "";
    let listsEl = document.createElement("ul");
    listsEl.classList.add("input-list");
    lists.forEach((list)=>{
        listsEl.innerHTML += `<li>${list.task}</li>`
    })
    listValue.appendChild(listsEl);
}

document.querySelector("#new").addEventListener("click",()=>{
    document.querySelector(".container #form").classList.toggle("show");
})