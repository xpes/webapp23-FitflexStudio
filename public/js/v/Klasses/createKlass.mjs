/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import Klass, { WeekEL } from "../../m/Klass.mjs";
 import Person from "../../m/Person.mjs";
 import { fillSelectWithOptions, createMultiSelectionWidget } from "../../../lib/util.mjs";
 import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";
 
 /***************************************************************
  Load data
  ***************************************************************/
 
 
 /***************************************************************
  Declare variables for accessing UI elements
  ***************************************************************/
 const formEl = document.forms["Klass"],
     createButton = formEl["commit"],
     progressEl = document.querySelector("progress");
 
 
 const createWeekSelectEl = formEl.scheduleWeek;
 fillSelectWithOptions(createWeekSelectEl, WeekEL.labels);
 
 // add event listeners for responsive validation
 formEl["klassId"].addEventListener("input", function () {
     // do not yet check the ID constraint, only before commit
     formEl["klassId"].setCustomValidity(Klass.checkKlassId(formEl["klassId"].value).message);
     formEl["klassId"].reportValidity();
 });
 formEl["klassName"].addEventListener("input", function () {
     formEl["klassName"].setCustomValidity(Klass.checkKlassName(formEl["klassName"].value).message);
     formEl["klassName"].reportValidity();
 });

 formEl["startDate"].addEventListener("input", function () {
     formEl["startDate"].setCustomValidity(Klass.checkStartDate(formEl["startDate"].value).message);
     formEl["startDate"].reportValidity();
 });
 formEl["endDate"].addEventListener("input", function () {
     formEl["endDate"].setCustomValidity(Klass.checkStartDate(formEl["endDate"].value).message);
     formEl["endDate"].reportValidity();
 });
 formEl["capacity"].addEventListener("input", function () {
     formEl["capacity"].setCustomValidity(Klass.checkCapacity(formEl["capacity"].value).message);
     formEl["capacity"].reportValidity();
 });
 formEl["scheduleWeek"].addEventListener("input", function () {
     formEl["scheduleWeek"].setCustomValidity(Klass.checkScheduleWeek(formEl["scheduleWeek"].value).message);
     formEl["scheduleWeek"].reportValidity();
 });
 
 formEl["scheduleTime"].addEventListener("input", function () {
     formEl["scheduleTime"].setCustomValidity(Klass.checkScheduleTime(formEl["scheduleTime"].value).message);
     formEl["scheduleTime"].reportValidity();
 });
 
 formEl["duration"].addEventListener("input", function () {
     formEl["duration"].setCustomValidity(Klass.checkDuration(formEl["duration"].value).message);
     formEl["duration"].reportValidity();
 });

 
 /******************************************************************
  Add event listeners for the create/submit button
  ******************************************************************/
 createButton.addEventListener("click", async function () {
     const slots = {
         klassId: formEl["klassId"].value,
         klassName: formEl["klassName"].value,
         startDate: formEl["startDate"].value,
         endDate: formEl["startDate"].value,
         capacity: formEl["capacity"].value,
         scheduleWeek: formEl["scheduleWeek"].value,
         scheduleTime: formEl["scheduleTime"].value,
         duration: formEl["duration"].value
     };
     // check constraints and set error messages
     showProgressBar(progressEl);
     formEl["klassId"].setCustomValidity((await Klass.checkKlassIdAsId(slots.klassId)).message);
     formEl["klassId"].reportValidity();
     formEl["klassName"].setCustomValidity(Klass.checkKlassName(slots.klassName).message);
     formEl["startDate"].setCustomValidity(Klass.checkStartDate(slots.startDate).message);
     formEl["endDate"].setCustomValidity(Klass.checkEndDate(slots.endDate).message);
     formEl["capacity"].setCustomValidity(Klass.checkCapacity(slots.capacity).message);
     formEl["scheduleWeek"].setCustomValidity(Klass.checkScheduleWeek(slots.scheduleWeek).message);
     formEl["scheduleTime"].setCustomValidity(Klass.checkScheduleTime(slots.scheduleTime).message);
     formEl["duration"].setCustomValidity(Klass.checkDuration(slots.duration).message); 
     if (formEl.checkValidity()) {
         console.log(slots);
         await Klass.add(slots);
         formEl.reset();
     }
     hideProgressBar(progressEl);
 });
 // neutralize the submit event
 formEl.addEventListener("submit", function (e) {
     e.preventDefault();
 });