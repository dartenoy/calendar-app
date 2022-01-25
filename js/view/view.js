"use strict";
import { currentMonth, tiles, prevMonth, nextMonth } from "../config.js";
const btnPrev = document.querySelector(".button--prev");
const btnNext = document.querySelector(".button--next");
const addEventBtn = document.querySelector(".add-event-button");
const confirmButton = document.querySelector(".confirm");
const cancelButton = document.querySelector(".cancel");
const deleteButton = document.querySelector(".delete");
const closeButton = document.querySelector(".close");

const year = document.querySelector(".year");
const month = document.querySelector(".month");
const daysContainer = document.querySelector(".days-container");
const eventContainer = document.querySelector(".add-event");
const eventForm = document.querySelector(".add-event-form");
const eventData = document.querySelector(".existing-event");
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventStartTime = document.getElementById("eventStartTime");
const eventEndTime = document.getElementById("eventEndTime");
const eventType = document.getElementById("eventType");
const eventDescription = document.getElementById("eventDescription");

const errMsg = document.querySelector(".errMessage");
const modalErr = document.querySelector(".modal-err");
const modal = document.querySelector(".modal");

//Functions

const addHidden = (element) => {
  element.classList.add("hidden");
};

const removeHidden = (element) => {
  element.classList.remove("hidden");
};

const loadMonth = (m, year = "2022") =>
  (month.textContent = new Date(year, m).toLocaleString("en-us", {
    month: "long",
  }));

const loadYear = (y) => {
  year.textContent = y;
};

///Generates tiles
const createTiles = (
  tiles,
  classes,
  prevMonth = false,
  lastDay = "",
  curDay = "",
  createID = false
) => {
  let calendarStart = "";

  if (tiles == 0) tiles = 7; //If month starts on monday, adds some previous month tiles

  if (prevMonth) calendarStart = lastDay - tiles + 1; // if tiles are being created for prev month days, calculates the starting day

  for (let i = 1; i <= tiles; i++) {
    const tile = document.createElement("div");
    const dayNumber = document.createElement("div");

    tile.classList.add(...classes);
    dayNumber.classList.add("day-number");

    if (createID) tile.id = `d${i}`;
    if (curDay == i) tile.classList.add("current"); // If current day is specified, renders correct current day on calendar

    if (prevMonth) dayNumber.innerText = calendarStart++; //If tiles are from previous month, assigns correct day
    if (!prevMonth) dayNumber.innerText = i; //if Tiles are from previous or next month, assigns correct day
    dayNumber.classList;
    tile.appendChild(dayNumber);

    daysContainer.appendChild(tile);
  }
};
//Loading correct month name

export const load = (state) => {
  // 1) clears month view
  daysContainer.innerHTML = "";

  //Assigns tiles from config
  let tilesLeft = tiles;

  loadMonth(state.month);
  loadYear(state.year);

  // 2) Creating previous month tiles
  createTiles(state.daysFromLastMonth, prevMonth, true, state.lastDayPrevM);

  //  If month starts on monday, after adding extra line for prev month sets correct number of left tiles
  if (state.daysFromLastMonth == 0) {
    tilesLeft -= 7;
  } else {
    tilesLeft -= state.daysFromLastMonth;
  }

  // 3) Creating main month tiles , if month for loading is current month, pass in current day to show it on calendar
  JSON.stringify(state.curDate) ==
  JSON.stringify([state.year, state.month, state.day])
    ? createTiles(state.daysInMonth, currentMonth, false, "", state.day, true)
    : createTiles(state.daysInMonth, currentMonth);
  tilesLeft -= state.daysInMonth;

  // 4) creating next month tiles
  createTiles(tilesLeft, nextMonth);
  loadEvents(state);
};

const printEvent = (ev) => {
  const eventClass = ["event", `${ev.select}`];

  const printDay = document.getElementById("d" + Number(ev.date.split("-")[2]));

  const newElement = document.createElement("a");
  if (!newElement) return;

  newElement.classList.add(...eventClass);
  if (ev.title.length < 10) newElement.innerText = ev.title;
  if (ev.title.length > 10) newElement.innerText = `${ev.title.slice(0, 9)}...`;
  newElement.href = `#${ev.id}`;

  printDay.appendChild(newElement);
  printDay.href = ev.id; // newElement.innerText = `${ev.title.leng}`
};

const loadEvents = (state) => {
  state.events.forEach((ev) => {
    const eventDate = ev.date.split("-");

    if (eventDate[0] == state.year && eventDate[1].slice(-1) == state.month + 1)
      printEvent(ev);
  });
};

export const RenderEvent = (ev) => {
  addHidden(eventForm);
  addHidden(addEventBtn);
  removeHidden(eventData);
  if (!ev) return;

  let evType = "";
  if (ev.select == "meeting") evType = "Meeting";
  if (ev.select == "call") evType = "Call";
  if (ev.select == "out-of-office") evType = "Out of office";
  eventTitle.textContent = ev.title;
  eventDate.textContent = `${ev.date}`;
  eventStartTime.textContent = `Start time:${ev.startTime}`;
  eventEndTime.textContent = `End time:${ev.endTime}`;
  eventType.textContent = evType;
  eventDescription.textContent = ev.description;
};

export const printError = (message) => {
  removeHidden(modalErr);
  errMsg.textContent = message;
};

//Adding handler functions to event listeners
export const addHandlerDaysContainer = (handler) => {
  daysContainer.addEventListener("click", function (e) {
    addHidden(eventContainer);
    const prevSelected = document.querySelector(".selected");
    if (prevSelected) prevSelected.classList.remove("selected");
    const parentEl = e.target.parentElement;
    if (parentEl.classList.contains("month-view")) return;

    if (parentEl.classList.contains("day")) parentEl.classList.add("selected");
    if (e.target.classList.contains("day")) e.target.classList.add("selected");
    addHidden(eventData);
    removeHidden(addEventBtn);
    handler(e.target);
  });
};

export const addHandlerNextMonth = (handler) => {
  btnNext.addEventListener("click", handler);
};
export const addHandlerPrevMonth = (handler) => {
  btnPrev.addEventListener("click", handler);
};
export const addHandlerAddNewEvent = () => {
  addEventBtn.addEventListener("click", function () {
    addHidden(addEventBtn);
    removeHidden(eventContainer);
    removeHidden(eventForm);
  });
};
// export const addHandler

export const addHandlerSubmit = (handler) => {
  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    removeHidden(eventForm);
    const dataArr = [...new FormData(eventForm)];

    const data = Object.fromEntries(dataArr);

    handler(data);
    addHidden(eventContainer);
    removeHidden(addEventBtn);
    eventForm.reset();
  });
};
export const addHandlerRenderEvent = (handler) => {
  ["hashchange", "load"].forEach((ev) => window.addEventListener(ev, handler));
};
export const addHandlerDeleteEvent = (handler) => {
  deleteButton.addEventListener("click", function () {
    removeHidden(modal);
    confirmButton.addEventListener("click", function () {
      addHidden(modal);
      addHidden(eventData);
      removeHidden(addEventBtn);
      handler();
    });
  });
};
cancelButton.addEventListener("click", function () {
  addHidden(modal);
});

closeButton.addEventListener("click", function () {
  addHidden(modalErr);
});
