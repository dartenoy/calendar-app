"use strict";
import { weekdays, testData } from "./config.js";

export let index = 0;

const date = new Date();

export const state = {
  curDate: "",
  date: date,
  events: [],
  year: "",
  month: "",
  day: "",
  daysFromLastMonth: "",
  daysInMonth: "",
  lastDayPrevM: "",
  selected: "",
};

state.year = date.getFullYear();
state.month = date.getMonth();
state.day = date.getDate();
state.curDate = [state.year, state.month, state.day];
export const setLastDayFromPrevMonth = (year, month) =>
  new Date(year, month, 0).toLocaleDateString("en-us", { day: "numeric" });

export const setDaysFromLastMonth = (year, month, weekdays) =>
  weekdays.indexOf(
    new Date(year, month, 1).toLocaleString("en-us", { weekday: "long" })
  );

export const setDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).toLocaleString("en-us", { day: "numeric" });

export const updateMonth = (value) => {
  date.setMonth(date.getMonth() + value);
  updateState();
};
export const updateEvents = (data) => {
  data.id = setID();
  state.events.push(data);
  saveEvents();
};
export const validateData = (data) => {
  const timeStart = data.startTime.split(":");
  const timeEnd = data.endTime.split(":");

  if (timeStart[0] < timeEnd[0]) return true;
  if (timeStart[0] == timeEnd[0] && timeStart[1] < timeEnd[1]) return true;
  return false;
};
export const findEvent = (id) => {
  const searchedEvent = state.events[findIndex(id)];
  if (searchedEvent !== -1) return searchedEvent;
  return;
};

const findIndex = (id) => {
  return state.events.findIndex((el) => el.id == id);
};

const saveEvents = () => {
  sessionStorage.setItem("events", JSON.stringify(state.events));
};
export const deleteEvent = (id) => {
  const index = findIndex(id);

  if (index == -1) return;

  state.events.splice(index, 1);
  if (state.events.length == 0) {
    sessionStorage.removeItem("events");
  } else {
    saveEvents();
  }
};

const setID = () => {
  let condition = false;
  let id;
  while (!condition) {
    id = Math.trunc(Math.random() * 1000000);
    if (findIndex(id) == -1) condition = true;
  }
  return id;
};

const updateState = () => {
  state.year = date.getFullYear();
  state.month = date.getMonth();
  state.day = date.getDate();
  state.daysFromLastMonth = setDaysFromLastMonth(
    state.year,
    state.month,
    weekdays
  );
  state.daysInMonth = setDaysInMonth(state.year, state.month);
  state.lastDayPrevM = setLastDayFromPrevMonth(state.year, state.month);
};
updateState();
const init = () => {
  const storage = sessionStorage.getItem("events");

  if (storage) state.events = JSON.parse(storage);

  if (!storage) state.events = testData;
};
init();
