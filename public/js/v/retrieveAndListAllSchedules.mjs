/**
 * @fileOverview  View methods for the use case "retrieve and list Persons"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nour elhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Schedule, { WeekEl } from "../m/Schedule.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const ScheduleRecords = await Schedule.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#Schedules>tbody");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
// for each Person, create a table row with a cell for each attribute
for (const ScheduleRec of ScheduleRecords) {
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = ScheduleRec.scheduleId;
  row.insertCell().textContent = ScheduleRec.klassName;
  row.insertCell().textContent = ScheduleRec.startDate;
  row.insertCell().textContent = ScheduleRec.endDate;
  row.insertCell().textContent = ScheduleRec.instructor;
  row.insertCell().textContent = WeekEl.labels[ScheduleRec.scheduleWeek - 1];
  row.insertCell().textContent = ScheduleRec.scheduleTime;
  row.insertCell().textContent = ScheduleRec.duration;
}
