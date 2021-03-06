// Set a day of week
const time = new Date();
const day = time.getDay();
let actualDay;
const actualDaySpan = document.querySelector('span.actual-day');
const actualDateSpan = document.querySelector('span.actual-date');

switch (day) {
    case 0:
        actualDay = "niedziela";
        break;
    case 1:
        actualDay = "poniedziałek";
        break;
    case 2:
        actualDay = "wtorek";
        break;
    case 3:
        actualDay = "środa";
        break;
    case 4:
        actualDay = "czwartek";
        break;
    case 5:
        actualDay = "piątek";
        break;
    case 6:
        actualDay = "sobota";
        break;
}
actualDaySpan.textContent = actualDay;

const dayNumber = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
const monthNumber = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
const yearNumber = time.getFullYear();

actualDateSpan.textContent = dayNumber + "." + monthNumber + "." + yearNumber;

// Set a time
const clock = () => {
    const time = new Date();
    const seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    const hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();

    const actualTimeSpan = document.querySelector('span.actual-time');
    actualTimeSpan.textContent = `${hours}:${minutes}:${seconds}`
}
setInterval(clock, 1000);


//  LIST OF TASK

//Element of HTML
const form = document.querySelector('form');
const inputForNewTask = document.querySelector('input.new-task');
const btnNewTask = document.querySelector('button.add-task');
const listTasks = document.querySelector('ul.list-tasks');
const doneListTask = document.querySelector('ul.done-list-tasks');
const numberTasks = document.querySelector('span.tasks-number');
const doneNumberTasks = document.querySelector('span.done-tasks-number');

//Main lists of task
const toDoList = []; //list of actual task
const doneList = []; // lit of done task
numberTasks.textContent = "Wyznacz sobie zadania do wykonania na dziś."

// Reload of list of actual tasks
const getActualLists = () => {
    listTasks.textContent = "";
    toDoList.forEach((toDoTask, key) => {
        toDoTask.dataset.key = key;
        listTasks.appendChild(toDoTask);
    })

    doneListTask.textContent = "";
    doneList.forEach((doneTask, key) => {
        doneTask.dataset.key = key;
        doneListTask.appendChild(doneTask);
    })

    getStatusList();

}


const getStatusList = () => {
    if (toDoList.length === 0) {
        return numberTasks.textContent = "Wszystkie zadania wykonane -  masz wolne! :)",
            doneNumberTasks.textContent = `Super! Wszystkie zadania wykonane!`;
    }
    numberTasks.textContent = toDoList.length;
    doneNumberTasks.textContent = doneList.length;

    if (doneList.length === 0) {
        return doneNumberTasks.textContent = "Brak ukończonych zadań - bierz się do pracy!"

    }


}


const removeTask = (e) => {
    const index = e.target.parentNode.dataset.key;
    const ulIndex = e.target.parentNode.parentNode;
    if (ulIndex.className === "list-tasks") {
        toDoList.splice(index, 1);
    } else {
        doneList.splice(index, 1);
    }

    getActualLists();
}

const doneTask = (e) => {
    const task = e.target.parentNode;
    const index = task.dataset.key;
    toDoList.splice(index, 1);
    // task.removeChild(task.children[1]);
    task.removeChild(task.children[0]);
    doneList.push(task);

    getActualLists();
}

//Add task to main list of task
const addTask = (e) => {
    e.preventDefault();
    const task = inputForNewTask.value;
    if (task === "") return;
    const newTask = document.createElement('li');
    newTask.className = "task";
    newTask.innerHTML = task + '<i class="fas fa-check-circle done"></i><i class="fas fa-times-circle delete"></i>';
    toDoList.push(newTask);
    inputForNewTask.value = "";
    newTask.querySelector('i.done').addEventListener('click', doneTask);
    newTask.querySelector('i.delete').addEventListener('click', removeTask);
    getActualLists();

}

form.addEventListener('submit', addTask);


// STICKY NOTES BOARD

let draggedEl;
let grabPoinxY;
let grabPointX;

//function for mousedown - get position of sticy note
const onDragStart = function (e) {
    let boundingClientRect;
    if (e.target.className.indexOf('bar') === -1) {
        return; // not active for class 'bar'
    }
    draggedEl = this;

    boundingClientRect = draggedEl.getBoundingClientRect();

    grabPoinxY = boundingClientRect.top - e.clientY;
    grabPointX = boundingClientRect.left - e.clientX;
};

//set position during mosemove and reset for right site
const onDrag = (e) => {
    if (!draggedEl) {
        return;
    }

    const posX = e.clientX + grabPointX;
    const posY = e.clientY + grabPoinxY;

    if (posX < 0) {
        posX = 0;
    }
    if (posY < 0) {
        posY = 0;
    }

    draggedEl.style.transform = `translateX(${posX}px) translateY(${posY}px)`;
}

//reset global variable after mouseup
const onDragEnd = () => {
    draggedEl = null;
    grabPointX = null;
    grabPoinxY = null;
};

//set HTML element and CSS style for new sticky note
const createNote = () => {
    //set elements of sticky note
    const stickerEl = document.createElement('div');
    const barEl = document.createElement('div');
    const texareaEl = document.createElement('textarea');
    const deleteBtnElem = document.createElement('i');

    let transformCSSValue = `translateX(${Math.random() * 100}px) translateY(${Math.random() * 100}px)`; //random positon of new note

    //CSS style
    stickerEl.style.transform = transformCSSValue;
    stickerEl.classList.add('sticker');
    barEl.classList.add('bar');
    deleteBtnElem.classList.add('fas')
    deleteBtnElem.classList.add('fa-times-circle');
    deleteBtnElem.classList.add('delete-note-btn')


    //place elements together
    barEl.appendChild(deleteBtnElem);
    stickerEl.appendChild(barEl);
    stickerEl.appendChild(texareaEl);

    //remove scticky note
    const onDelete = () => {
        document.body.removeChild(stickerEl);
    }

    //plug on Delete to btn 'X'
    deleteBtnElem.addEventListener('click', onDelete, false);
    stickerEl.addEventListener('mousedown', onDragStart, false);

    //append sticky elem to body of HTML
    document.body.appendChild(stickerEl);
}

//listening of moseevents
const addNoteButtonEl = document.querySelector('.add-note-button');
addNoteButtonEl.addEventListener('click', createNote, false);
document.addEventListener('mousemove', onDrag, false);
document.addEventListener('mouseup', onDragEnd, false);