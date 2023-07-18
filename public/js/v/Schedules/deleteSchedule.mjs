/**
 * @fileOverview  View methods for the use case "delete Person"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Schedule from "../../m/Schedule.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const ScheduleRecords = await Schedule.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Schedule"],
  deleteButton = formEl["commit"],
  selectScheduleEl = formEl["selectSchedule"];
let cancelListener = null;


/***************************************************************
 Set up select element
 ***************************************************************/
for (const ScheduleRec of ScheduleRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = ScheduleRec.scheduleName;
  optionEl.value = ScheduleRec.scheduleId;
  selectScheduleEl.add(optionEl, null);
}

/*******************************************************************
 Setup listener on the selected person record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected person record
selectScheduleEl.addEventListener("change", async function () {
  const scheduleKey = selectScheduleEl.value;
  if (scheduleKey) {
    // cancel record listener if a previous listener exists
    if (cancelListener) cancelListener();
    // add listener to selected person, returning the function to cancel listener
    cancelListener = await Schedule.observeChanges(scheduleKey);
  }
});

/******************************************************************
 Add event listeners for the delete/submit button
 ******************************************************************/
// set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
  const scheduleId = selectScheduleEl.value;
  if (!scheduleId) return;
  if (confirm("Do you really want to delete this schedule record?")) {
    await Schedule.destroy(scheduleId);
    // remove deleted Person from select options
    selectScheduleEl.remove(selectScheduleEl.selectedIndex);
  }
});