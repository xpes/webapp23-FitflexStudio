/**
 * @fileOverview  View methods for the use case "retrieve and list Schedules"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import Schedule, { WeekEL } from "../../m/Schedule.mjs";

 /***************************************************************
  Load data
  ***************************************************************/
 const ScheduleRecords = await Schedule.retrieveAll();
 
 /***************************************************************
  Declare variables for accessing UI elements
  ***************************************************************/
 const tableBodyEl = document.querySelector("table#Schedules>tbody");
 
 /***************************************************************
  Render list of all Schedule records
  ***************************************************************/
 // for each Schedule, create a table row with a cell for each attribute
 for (const ScheduleRec of ScheduleRecords) {
   const row = tableBodyEl.insertRow();
   row.insertCell().textContent = ScheduleRec.scheduleId;
   row.insertCell().textContent = ScheduleRec.klassName1;
   row.insertCell().textContent = ScheduleRec.instructor1;
   row.insertCell().textContent = WeekEL.labels[ScheduleRec.scheduleWeek - 1];
   row.insertCell().textContent = ScheduleRec.scheduleTime;
   row.insertCell().textContent = ScheduleRec.duration;

 }
 