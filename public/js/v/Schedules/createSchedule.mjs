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
 import klass from "../../m/Klass.mjs";
 import Klass from "../../m/Klass.mjs";
 
 const KlassRecords = await klass.retrieveAll();

 /***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Schedule"], 
createklassWidget = formEl.querySelector(".MultiSelectionWidget"),
createButton = formEl["commit"],
progressEl = document.querySelector("progress");

await createMultiSelectionWidget (formEl, [], "klasses",
  "id", "klassId", Klass.checkKlassIdAsIdRef, Klass.retrieve);
// set up the movie category selection list
const createWeekSelectEl = formEl.scheduleWeek;
fillSelectWithOptions(createWeekSelectEl, WeekEL.labels);

// add event listeners for responsive validation
formEl["scheduleId"].addEventListener("input", function () {
// do not yet check the ID constraint, only before commit
    formEl["scheduleId"].setCustomValidity(Schedule.checkScheduleId(formEl["scheduleId"].value).message);
    formEl["scheduleId"].reportValidity();
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