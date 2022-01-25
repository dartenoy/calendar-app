"use strict";
import * as config from "./config.js";
import * as model from "./model.js";
import * as View from "./view/view.js";

//Handlers
const nextMonthHandler = () => {
  model.updateMonth(1);
  load();
};

const prevMonthHandler = () => {
  model.updateMonth(-1);
  load();
};

const controlMonthViewClick = (target) => {
  const selectedDay =
    document.querySelector(".selected").firstChild.textContent;

  if (
    target.classList.contains("prev-month") ||
    target.parentElement.classList.contains("prev-month")
  )
    prevMonthHandler();
  if (
    target.classList.contains("next-month") ||
    target.parentElement.classList.contains("next-month")
  )
    nextMonthHandler();
  window.location.hash = "";
};

////

const controlSubmit = (data) => {
  const valid = model.validateData(data);

  if (!valid) {
    View.printError("Event end time must be later then start time.");
    return;
  }
  model.updateEvents(data);
  load();
};

const controlEventRender = () => {
  const hashId = getHash();

  if (!hashId) return;
  const foundEvent = model.findEvent(hashId);
  foundEvent ? View.RenderEvent(model.findEvent(hashId)) : View.printError();
};
const controlDeleteEvent = () => {
  const hashId = getHash();
  if (!hashId) return;
  model.deleteEvent(hashId);
  window.location.hash = "";
  load();
};

////////Functions
const load = () => {
  View.load(model.state);
};
const getHash = () => {
  return window.location.hash.slice(1);
};

const init = () => {
  View.addHandlerNextMonth(nextMonthHandler);
  View.addHandlerPrevMonth(prevMonthHandler);
  View.addHandlerDaysContainer(controlMonthViewClick);
  View.addHandlerAddNewEvent();
  View.addHandlerSubmit(controlSubmit);
  View.addHandlerRenderEvent(controlEventRender);
  View.addHandlerDeleteEvent(controlDeleteEvent);
  load();
};
init();
