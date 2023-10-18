const mainContainer = document.querySelector(".main");

const headerSection = document.querySelector(".header");

const modalContainer = document.querySelector(".modalContainer");

const modalPriority = document.querySelector(".modalPriority");

const modaltask = document.querySelector(".modalPriority");

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
    return;
  }

  if (element.textContent === "Short Break" && shortBreakCheck) {
    const sB = createTimerScreen("05:00", "Short Break");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    console.log(sB);
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
    console.log(element);
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
    return;
  }
  if( element.classList.contains('fa-plus')){
    if(!todoAppended){
      alert("Select Timer First");
      return;
    }
    modalContainer.style.display = 'flex';
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

    console.log(intervalId);
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
});


modalContainer.addEventListener("click", (e) => {
  const element = e.target;
  if (element.classList.contains("modalButton")) {
    const taskBox = taskCreator(modalPriority.value, modaltask.value);
    todoDiv.append(taskBox);
    modalContainer.style.display = "none";
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

function taskCreator(priority, task) {
  if (!todoAppended) {
    return;
  }

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

  const checkBoxContainer = createElement(
    "div",
    { className: "checkBox" },
    checkBox,
    trash
  );

  const taskContainer = createElement(
    "div",
    { className: "taskContainer" },
    taskPriority,
    currentTask,
    checkBoxContainer
  );

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
