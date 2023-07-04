/**
 * @fileOverview  View methods for the use case "delete Person"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author NourElhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import Schedule from "../m/Schedule.mjs";

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
 
 /***************************************************************
  Set up select element
  ***************************************************************/
 for (const ScheduleRec of ScheduleRecords) {
   const optionEl = document.createElement("option");
   optionEl.text = ScheduleRec.KlassName;
   optionEl.value = ScheduleRec.scheduleId;
   selectScheduleEl.add(optionEl, null);
 }
 
 /******************************************************************
  Add event listeners for the delete/submit button
  ******************************************************************/
 // set an event handler for the delete button
 deleteButton.addEventListener("click", async function () {
   const scheduleId = selectScheduleEl.value;
   if (!scheduleId) return;
   if (confirm("Do you really want to delete this Schedule record?")) {
     await Schedule.destroy(scheduleId);
     // remove deleted Person from select options
     selectScheduleEl.remove(selectScheduleEl.selectedIndex);
   }
 });