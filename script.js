const mainContainer = document.querySelector(".main");

const headerSection = document.querySelector(".header");

const modalContainer = document.querySelector(".modalContainer");

const uid = new ShortUniqueId({ length: 6 });

let pomoInitializer = true;

let shortBreakCheck = true;

let longBreakCheck = true;

let intervalId = null;

let timerOn = false;

let pause = false;

let currentMin = 0;

let currentSec = 0;

let minutes = 0;

let seconds = 0;

let resume = false;

let tabChanged = false;

let titleDisplay = document.querySelector("title");

let todoDiv;

let todoAppended = false;

let taskArray = [];

let taskRestored = false;

// event listeners

headerSection.addEventListener("click", (e) => {
  const element = e.target;

  if (timerOn && !confirm("This will reset current Timer !!")) {
    return;
  }

  if (element.textContent === "Pomodoro" && pomoInitializer) {
    const ele = createTimerScreen("25:00", "Pomodoro Timer");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    todoDiv
      ? mainContainer.insertBefore(ele, todoDiv)
      : mainContainer.appendChild(ele);
    shortBreakCheck = true;
    pomoInitializer = false;
    longBreakCheck = true;
    fadeFn(element);
    timerOn = false;
    pause = false;
    resume = false;
    intervalId ? clearInterval(intervalId) : {};
    tabChanged = true;
    titleDisplay.textContent = "Pomodoro Timer";
    todoAppendor();
    taskRestorer();
    return;
  }

  if (element.textContent === "Short Break" && shortBreakCheck) {
    const sB = createTimerScreen("05:00", "Short Break");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    //console.log(sB);
    todoDiv
      ? mainContainer.insertBefore(sB, todoDiv)
      : mainContainer.appendChild(sB);
    shortBreakCheck = false;
    pomoInitializer = true;
    longBreakCheck = true;
    fadeFn(element);
    timerOn = false;
    pause = false;
    resume = false;
    intervalId ? clearInterval(intervalId) : {};
    tabChanged = true;
    titleDisplay.textContent = "Short Break";
    todoAppendor();
    taskRestorer();
    return;
  }

  if (element.textContent === "Long Break" && longBreakCheck) {
    const sB = createTimerScreen("10:00", "Long Break");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    todoDiv
      ? mainContainer.insertBefore(sB, todoDiv)
      : mainContainer.appendChild(sB);
    shortBreakCheck = true;
    pomoInitializer = true;
    longBreakCheck = false;
    timerOn = false;
    pause = false;
    resume = false;
    fadeFn(element);
    intervalId ? clearInterval(intervalId) : {};
    tabChanged = true;
    titleDisplay.textContent = "Long Break";
    todoAppendor();
    taskRestorer();
    return;
  }
  if (element.classList.contains("fa-plus")) {
    if (!todoAppended) {
      alert("Select Timer First");
      return;
    }
    modalContainer.style.display = "flex";

    return;
  }
});


mainContainer.addEventListener("click", (e) => {
  const element = e.target;

  if (element.classList.contains("fa-play")) {
    const timerScr = document.querySelector(".timerScreen");

    if (resume) {
      timerCounter(0, 0, timerScr);
      pause = false;
      resume = false;
      fadeFn(element);
      return;
    }

    if (timerOn) {
      return;
    }

    //console.log(intervalId);
    intervalId ? clearInterval(intervalId) : {};

    if (!shortBreakCheck) {
      timerCounter(5, 0, timerScr);
    } else if (!longBreakCheck) {
      timerCounter(10, 0, timerScr);
    } else if (!pomoInitializer) {
      timerCounter(25, 0, timerScr);
    }
    timerOn = true;
    fadeFn(element);
    tabChanged = false;
    pause = false;
    resume = false;
    titleDisplay.textContent = "Pomodoro Timer";
    return;
  }

  if (element.classList.contains("fa-pause")) {
    if (pause === false && intervalId && !tabChanged) {
      clearInterval(intervalId);
      pause = true;
      resume = true;
      fadeFn(element);
      alert("Timer Paused");
    }
  }

  if (element.classList.contains("fa-rotate-right")) {
    if (!intervalId) {
      return;
    }

    if (!confirm("You Want to Reset Timer")) {
      fadeFn(element);
      return;
    }
    resume = false;
    clearInterval(intervalId);

    fadeFn(element);

    pause = false;

    timerOn = false;

    const timerDisplay = document.querySelector(".timerScreen");

    titleDisplay.textContent = "Pomodoro Timer";

    if (!shortBreakCheck) {
      timerDisplay.textContent = "05:00";
    } else if (!longBreakCheck) {
      timerDisplay.textContent = "10:00";
    } else if (!pomoInitializer) {
      timerDisplay.textContent = "25:00";
    }

    return;
  }

  if (element.classList[1] === "fa-square") {
    const parent = element.parentElement;

    const trash = parent.children[1];

    const tick = createElement("i", {
      className: "fa-regular fa-square-check",
    });

    parent.insertBefore(tick, trash);

    element.remove();

    const grandParent = parent.parentElement;

    alert(`${grandParent.children[1].textContent} is Done !!`);

    return;
  }

  if (element.classList.contains("fa-square-check")) {
    alert("This task is already Done !!");
    return;
  }

  if (element.classList.contains("fa-trash")) {
    const taskName = element.parentElement.parentElement.children[1].textContent;

    const currentElement = element.parentElement.parentElement;

    const id = currentElement.children[0];

    confirm(`Do you want to delete ${taskName} ?`)
      ? currentElement.remove()
      : {};
    
      taskDelete(id);

    if (todoDiv.children.length === 0) {
      todoDiv.style.display = "none";
      headerSection.style.borderBottom = "";
    }

    return;
  }
});


modalContainer.addEventListener("click", (e) => {
  const element = e.target;

  let taskName = element.parentElement.children[0];

  let taskText = element.parentElement.children[1];

  if (element.classList.contains("modalButton")) {
    if (taskName.value === "" || taskText.value === "") {
      modalContainer.style.display = "none";
      return;
    }

    const taskBox = taskCreator(undefined, taskName.value, taskText.value);
    todoDiv.append(taskBox);
    modalContainer.style.display = "none";
    todoDiv.style.display = "flex";
    headerSection.style.borderBottom = "2.5px solid black";
    taskName.value = "";
    taskText.value = "";
  }
  return;
});

//  Function section //


function timerCounter(min, sec, element) {
  if (resume) {
    min = minutes;
    sec = seconds;
  } else {
    min = +min;
    sec = +sec;
  }

  if (!resume && !confirm("Start Timer Right Now ?")) {
    return;
  }

  intervalId = setInterval(() => {
    if (min === 0 && sec === 0) {
      clearInterval(intervalId);
      alert("timer over");
      return;
    }

    if (sec === 0) {
      sec = 60;
      min -= 1;
    }

    sec = sec - 1;

    element.textContent = `${min}:${sec}`;
    titleDisplay.textContent = `${min}:${sec}`;
    if (min / 10 < 1) {
      element.textContent = `0${min}:${sec}`;
      titleDisplay.textContent = `0${min}:${sec}`;
    }

    if (sec / 10 < 1) {
      element.textContent = `${min}:0${sec}`;
      titleDisplay.textContent = `${min}:0${sec}`;
    }

    if (min / 10 < 1 && sec / 10 < 1) {
      element.textContent = `0${min}:0${sec}`;
      titleDisplay.textContent = `0${min}:0${sec}`;
    }
    minutes = min;
    seconds = sec;
  }, 1000);
}



function CopytimerCounter(min, sec, element) {
  if (resume) {
    min = minutes;
    sec = seconds;
  } else {
    min = +min;
    sec = +sec;
  }

  if (!resume && !confirm("Start Timer Right Now ?")) {
    return;
  }

  intervalId = setInterval(() => {
    if (min === 0 && sec === 0) {
      clearInterval(intervalId);
      alert("timer over");
      return;
    }

    if (sec === 0) {
      sec = 60;
      min -= 1;
    }

    sec = sec - 1;

    element.textContent = `${min}:${sec}`;
    titleDisplay.textContent = `${min}:${sec}`;
    if (min / 10 < 1) {
      element.textContent = `0${min}:${sec}`;
      titleDisplay.textContent = `0${min}:${sec}`;
    }

    if (sec / 10 < 1) {
      element.textContent = `${min}:0${sec}`;
      titleDisplay.textContent = `${min}:0${sec}`;
    }

    if (min / 10 < 1 && sec / 10 < 1) {
      element.textContent = `0${min}:0${sec}`;
      titleDisplay.textContent = `0${min}:0${sec}`;
    }
    minutes = min;
    seconds = sec;
  }, 1000);
}



function taskDelete(id) {
  let index = 0;

  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].taskId === id) {
      index = i;
      break;
    }
  }
  taskArray.splice(index, 1);
  setLocalStorage();
  return;
}



function taskRestorer() {
  if (localStorage.getItem("taskData") !== null && !taskRestored) {
    let data = localStorage.getItem("taskData");
    taskArray = JSON.parse(data);
    //console.log(taskArray);
    todoAppendor();
    todoDiv.style.display = "flex";

    for (let i = 0; i < taskArray.length; i++) {
      const element = taskCreator(
        taskArray[i].taskId,
        taskArray[i].taskPriority,
        taskArray[i].taskContent
      );
      //console.log(element);
      todoDiv.appendChild(element);
    }
    taskRestored = true;
  }
  return;
}

function taskCreator(uId, priority, task) {
  let id = uid.rnd();

  if (uId !== undefined) {
    id = uId;
  }

  const taskId = createElement("div", { className: "taskId", textContent: id });

  const taskPriority = createElement("div", {
    className: "priority",
    textContent: priority,
  });

  const currentTask = createElement("textArea", {
    className: "task",
    textContent: task,
  });

  const checkBox = createElement("i", { className: "fa-regular fa-square" });

  const trash = createElement("i", { className: "fa-solid fa-trash" });

  trash.style.color = "red";

  const checkBoxContainer = createElement(
    "div",
    { className: "checkBoxContainer" },
    checkBox,
    trash
  );

  const taskContainer = createElement(
    "div",
    { className: "taskContainer" },
    taskId,
    taskPriority,
    currentTask,
    checkBoxContainer
  );
  //console.log(uId);
  if (uId === undefined) {
    let taskData = {
      taskId: id,
      taskPriority: priority,
      taskContent: task,
    };
    taskArray.push(taskData);
    setLocalStorage();
  }

  return taskContainer;
}

function todoAppendor() {
  if (todoAppended) {
    return;
  }

  todoDiv = createElement("div", { className: "todoBox" });
  todoAppended = true;

  mainContainer.appendChild(todoDiv);

  todoDiv.addEventListener("click", (e) => {
    const element = e.target;

    if (element.classList.contains("fa-plus")) {
      modalContainer.style.display = "flex";
    }
  });
}

function fadeFn(element) {
  element.style.opacity = 0.4;
  setTimeout(() => (element.style.opacity = 1), 200);
  return;
}

function createElement(elementType = "div", properties, ...children) {
  const element = document.createElement(elementType);
  for (let key in properties) {
    element[key] = properties[key];
  }
  children.forEach((child) => {
    element.appendChild(child);
  });
  return element;
}

function createTimerScreen(timer, task) {
  const text = createElement("div", {
    className: "text",
    textContent: task,
  });

  const screen = createElement("div", {
    className: "timerScreen",
    textContent: timer,
  });

  const resetButton = createElement("i", {
    className: "fa-solid fa-rotate-right",
  });

  const pauseButton = createElement("i", { className: "fa-solid fa-pause" });

  const playButton = createElement("i", { className: "fa-solid fa-play" });

  const buttons = createElement(
    "div",
    { className: "timerButtons" },
    playButton,
    pauseButton,
    resetButton
  );

  const timerComp = createElement(
    "div",
    { className: "timer" },
    text,
    screen,
    buttons
  );

  return timerComp;
}

function setLocalStorage() {
  let data = JSON.stringify(taskArray);
  //console.log(data);
  localStorage.setItem("taskData", data);
  return;
}
