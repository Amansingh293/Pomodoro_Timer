const mainContainer = document.querySelector(".main-container");

const modalConatainer = document.querySelector(".modal-container");

const headerSection = document.querySelector(".header");

const toolColors = headerSection.querySelectorAll(".colors");

const modalButtons = document.querySelectorAll(".modal-button");

const deleteBtn = headerSection.querySelector(".delete");

const uid = new ShortUniqueId({ length: 6 });

let ticketHolderArray = [];

const fixedColors = ["red", "yellow", "green", "grey"];

let creationMode = false;

let deleteCheck = false;

let currentSelectedColor;

let lockButton = true;

let isAnyColorSelected = false;

if (localStorage.getItem("localArr") !== null) {
  let tempArr = localStorage.getItem("localArr");
  ticketHolderArray = JSON.parse(tempArr);
  ticketInitializer();
}

function createElement(elementType = "div", properties, ...children) {
  const element = document.createElement(elementType);

  for (let key in properties) {
    element[key] = properties[key];
  }

  children.forEach((child) => {
    element.append(child);
  });

  return element;
}

function createTicket(tktId, color, task, initializer) {
  
  let id = uid.rnd();

  if (initializer === null) {
    id = tktId;
  }

  const ticketColor = createElement("div", {
    className: `ticket-color ${color}`,
  });

  const ticketId = createElement("p", {
    className: "ticket-id",
    textContent: id,
  });

  const textBox = createElement("textarea", {
    className: `ticket-task-area`,
    textContent: `${task}`,
    disabled: true,
  });

  const lock = createElement("i", { className: "fa-solid fa-lock" });

  const lockHolder = createElement(
    "div",
    { className: "ticket-editable" },
    lock
  );

  const mainTicket = createElement(
    "div",
    { className: "ticket-container" },
    ticketColor,
    ticketId,
    textBox,
    lockHolder
  );

  if (initializer !== null) {
    let ticket = { ticketId: id, ticketColor: color, ticketTask: task };
    ticketHolderArray.push(ticket);
    setLocalStorage();
  }

  return mainTicket;
}

/**************************Creating Ticket*************************/

headerSection.addEventListener("click", (e) => {
  const element = e.target;

  if (creationMode) {
    return;
  }

  if (element.classList.contains("fa-plus")) {
    if (deleteCheck) {
      alert("First Turn Off Delete Button !!");
      return;
    }
    currentSelectedColor = "red";

    modalConatainer.style.display = "flex";

    const ticketColor = modalConatainer.children[1].children[0];

    classRemoverAndUpdator(modalButtons, "selector");

    ticketColor.classList.add("selector");

    creationMode = true;

    modalConatainer.children[0].focus();
  }

  if (element.classList.contains("fa-trash")) {
    if (ticketHolderArray.length === 0) {
      alert("No Tickets To Delete !!");
      return;
    }
    if (deleteCheck === false) {
      deleteCheck = true;
      element.style.color = "red";
    } else {
      deleteCheck = false;
      element.style.color = "black";
    }
  }

  if (element.parentElement.classList.contains("toolBox-container")) {
    const clickedColor = element.classList[1];

    const totalTickets = document.querySelectorAll(".ticket-container");

    filterFunc(totalTickets, clickedColor);
  }
});

headerSection.addEventListener('dblclick' , (e)=>{

  const element = e.target;

  if( element.classList.contains('colors') === false){
    return;
  }
  const totalTickets = document.querySelectorAll(".ticket-container");

  filterFunc(totalTickets , undefined);
  
})
/************************Opening Modal Click*************************/

modalConatainer.addEventListener("click", (e) => {
  const target = e.target;

  if (target.localName !== "button") {
    return;
  }
  classRemoverAndUpdator(target.parentElement.children, "selector");

  target.classList.add("selector");

  if (target.classList.contains("modal-button")) {
    currentSelectedColor = target.classList[1];
  }
});

/************************Submiting Modal Container*************************/

modalConatainer.addEventListener("keypress", (e) => {
  const element = e.target;

  if (e.key !== "Enter") {
    return;
  } else if (e.key === "Enter" && e.shiftKey === true) {
    return;
  }

  modalConatainer.style.display = "none";

  const textValue = modalConatainer.children[0].value;

  if (!textValue) {
    creationMode = false;
    return;
  }

  modalConatainer.children[0].value = "";

  const createdTicket = createTicket(null, currentSelectedColor, textValue);

  mainContainer.append(createdTicket);

  creationMode = false;
});

/********************************Working on created ticket******************************/

mainContainer.addEventListener("click", (e) => {
  const element = e.target;

   if (creationMode) {
    return;
  }
  /**************handling Delete functionality***********************/
 

  if (deleteCheck) {
    const box = element.closest(".ticket-container");

    const delId = box.children[1].textContent;

    if (confirm("Ticket Selected Will Be Deleted !!")) {
      box.remove();
      ticketArrRemover(delId);
    }

    if (ticketHolderArray.length === 0) {
      setTimeout(() => {
        deleteCheck = false;
        deleteBtn.style.color = "black";
        alert("No More Tickets To Be Deleted!!");
      }, 400);
    }

    return;
  }
  /**************handling colorChanger on click functionality***********************/

  if (element.classList.contains("ticket-color")) {
    const currentColor = element.classList[1];

    const currentTicketId =
      element.closest(".ticket-container").children[1].textContent;

    let nextColor;

    for (let i = 0; i < fixedColors.length; i++) {
      let indexCalibrator = fixedColors[(i + 1) % fixedColors.length];

      if (currentColor === fixedColors[i]) {
        element.classList.remove(currentColor);
        element.classList.add(indexCalibrator);
        nextColor = indexCalibrator;
        break;
      }
    }

    ticketArrUpdater(currentTicketId, nextColor, undefined);
    return;
  }

  /**************handling textEditable on lock click functionality***********************/

  let textEditable;

  if (element.classList.contains("fa-lock")) {
    element.classList.remove("fa-lock");

    element.classList.add("fa-unlock");

    textEditable = element.parentElement.parentElement.children[2];

    textEditable.disabled = false;

    let textLength = textEditable.value.length;
    
    textEditable.focus();

    textEditable.setSelectionRange(textLength , textLength);

    return;
  }

  if (element.classList.contains("fa-unlock")) {
    element.classList.remove("fa-unlock");

    element.classList.add("fa-lock");

    textEditable = element.parentElement.parentElement.children[2];

    textEditable.disabled = true;

    const currentId = element.parentElement.parentElement.children[1].innerText;

    ticketArrUpdater(currentId, undefined, textEditable.value);

    setLocalStorage();
    return;
  }
});

/********************************making ticket editable******************************/

/********************************ticket updater in array******************************/
function ticketArrUpdater(tId, color, text) {
  for (let i = 0; i < ticketHolderArray.length; i++) {
    if (ticketHolderArray[i].ticketId === tId) {
      if (color !== undefined) {
        ticketHolderArray[i].ticketColor = color;
      }
      if (text !== undefined) {
        ticketHolderArray[i].ticketTask = text;
      }

      break;
    }
  }
  setLocalStorage();
  return;
}

/**************handling ticket from arrray removal on delete functionality***********************/

function ticketArrRemover(id) {
  for (let i = 0; i < ticketHolderArray.length; i++) {
    if (ticketHolderArray[i].ticketId === id) {
      ticketHolderArray.splice(i, 1);
    }
    setLocalStorage();
  }
  return;
}

/**************handling slector class remover on click functionality***********************/

function classRemoverAndUpdator(array, value) {
  for (let i = 0; i < array.length; i++) {
    array[i].classList.remove(value);
  }
  return;
}

/**************handling color filter on click functionality***********************/

function filterFunc(arr, currentColor) {
  for (let i = 0; i < arr.length; i++) {
    const currentElemColor = arr[i].children[0].classList[1];

    const currentElem = arr[i];

    if (currentElemColor === currentColor) {
      currentElem.style.display = "flex";
    } 
    else if(currentColor === undefined){
      currentElem.style.display = "flex";
    }
    else{
      currentElem.style.display = "none";
    }
  }
  return;
}

function ticketInitializer() {
  for (let i = 0; i < ticketHolderArray.length; i++) {
    const ticket = createTicket(
      ticketHolderArray[i].ticketId,
      ticketHolderArray[i].ticketColor,
      ticketHolderArray[i].ticketTask,
      null
    );

    mainContainer.append(ticket);
  }

  return;
}

function setLocalStorage() {
  let lArr = JSON.stringify(ticketHolderArray);

  localStorage.setItem("localArr", lArr);
  return;
}
