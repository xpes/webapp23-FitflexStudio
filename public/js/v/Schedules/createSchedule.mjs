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
 import Schedule, { WeekEL } from "../../m/Schedule.mjs";
 import { fillSelectWithOptions } from "../../../lib/util.mjs";
 import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";
 
 /***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Schedule"],
createButton = formEl["commit"],
progressEl = document.querySelector("progress");

// set up the movie category selection list
const createWeekSelectEl = formEl.scheduleWeek;
fillSelectWithOptions(createWeekSelectEl, WeekEL.labels);

// add event listeners for responsive validation
formEl["scheduleId"].addEventListener("input", function () {
// do not yet check the ID constraint, only before commit
    formEl["scheduleId"].setCustomValidity(Schedule.checkScheduleId(formEl["scheduleId"].value).message);
    formEl["scheduleId"].reportValidity();
});
formEl["klassName1"].addEventListener("input", function () {
    formEl["klassName1"].setCustomValidity(Schedule.checkKlassName1(formEl["klassName1"].value).message);
    formEl["klassName1"].reportValidity();
});

formEl["instructor1"].addEventListener("input", function () {
    formEl["instructor1"].setCustomValidity(Schedule.checkInstructor1(formEl["instructor1"].value).message);
    formEl["instructor1"].reportValidity();
});

formEl["scheduleWeek"].addEventListener("input", function () {
    formEl["scheduleWeek"].setCustomValidity(Schedule.checkScheduleWeek(formEl["scheduleWeek"].value).message);
    formEl["scheduleWeek"].reportValidity();
});

formEl["scheduleTime"].addEventListener("input", function () {
    formEl["scheduleTime"].setCustomValidity(Schedule.checkScheduleTime(formEl["scheduleTime"].value).message);
    formEl["scheduleTime"].reportValidity();
});

formEl["duration"].addEventListener("input", function () {
    formEl["duration"].setCustomValidity(Schedule.checkDuration(formEl["duration"].value).message);
    formEl["duration"].reportValidity();
});


/******************************************************************
Add event listeners for the create/submit button
******************************************************************/
createButton.addEventListener("click", async function () {
const slots = {
    scheduleId: formEl["scheduleId"].value,
    klassName: formEl["klassName"].value,
    instructor: formEl["instructor"].value,
    scheduleWeek: formEl["scheduleWeek"].value,
    scheduleTime: formEl["scheduleTime"].value,
    duration: formEl["duration"].value
};
// check constraints and set error messages
showProgressBar(progressEl);
formEl["scheduleId"].setCustomValidity((await Schedule.checkScheduleIdAsId(slots.scheduleId)).message);
formEl["scheduleId"].reportValidity();
formEl["klassName"].setCustomValidity(Schedule.checkKlassName(slots.klassName).message);
formEl["instructor"].setCustomValidity(Schedule.checkInstructor(slots.instructor).message);
formEl["scheduleWeek"].setCustomValidity(Schedule.checkScheduleWeek(slots.scheduleWeek).message);
formEl["scheduleTime"].setCustomValidity(Schedule.checkScheduleTime(slots.scheduleTime).message);
formEl["duration"].setCustomValidity(Schedule.checkDuration(slots.duration).message);

if (formEl.checkValidity()) {
    await Schedule.add(slots);
    formEl.reset();
}
hideProgressBar(progressEl);
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
e.preventDefault();
});



