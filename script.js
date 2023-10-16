const mainContainer = document.querySelector(".main");

const utilsButton = document.querySelector(".buttons");

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

utilsButton.addEventListener("click", (e) => {
  const element = e.target;

  console.log(element);

  if (element.textContent === "Pomodoro" && pomoInitializer) {
    const ele = createTimerScreen("25:00", "Pomodoro Timer");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    mainContainer.appendChild(ele);
    shortBreakCheck = true;
    pomoInitializer = false;
    longBreakCheck = true;
    fadeFn(element);
    console.log(element);
    return;
  }

  if (element.textContent === "Short Break" && shortBreakCheck) {
    const sB = createTimerScreen("05:00", "Short Break");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    mainContainer.appendChild(sB);
    shortBreakCheck = false;
    pomoInitializer = true;
    longBreakCheck = true;
    fadeFn(element);
    
    return
  }

  if (element.textContent === "Long Break" && longBreakCheck) {
    const sB = createTimerScreen("10:00", "Long Break");
    const pomoEle = document.querySelector(".timer");
    pomoEle ? pomoEle.remove() : {};
    mainContainer.appendChild(sB);
    shortBreakCheck = true;
    pomoInitializer = true;
    longBreakCheck = false;
    fadeFn(element);
    return;
  }
});

mainContainer.addEventListener("click", (e) => {
  const element = e.target;

  console.log(intervalId);

  // if(timerOn){
  //     return;
  // }

  if (element.classList.contains("fa-play")) {
    const timerScr = document.querySelector(".timerScreen");

    if (resume) {
      timerCounter(0, 0, timerScr);
      pause = false;
      fadeFn(element);
      resume = false;
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
    return;
  }

  if (element.classList.contains("fa-pause")) {
    if (pause === false && intervalId) {
      clearInterval(intervalId);
      pause = true;
      console.log("paused");
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
    minutes = 0;
    sec = 0;

    clearInterval(intervalId);

    fadeFn(element);

    pause = false;

    timerOn = false;

    const timerDisplay = document.querySelector(".timerScreen");

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

    if (min / 10 < 1) {
      element.textContent = `0${min}:${sec}`;
    }

    if (sec / 10 < 1) {
      element.textContent = `${min}:0${sec}`;
    }

    if (min / 10 < 1 && sec / 10 < 1) {
      element.textContent = `0${min}:0${sec}`;
    }
    minutes = min;
    seconds = sec;
    // console.log( sec/10);
  }, 1000);

  console.log(intervalId);
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
    textContent: `${task}`,
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