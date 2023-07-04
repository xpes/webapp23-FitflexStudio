/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nour elhouda Benaida
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import Schedule, { WeekEL } from "../m/Schedule.mjs";
 import { fillSelectWithOptions } from "../../lib/util.mjs";
 
 /***************************************************************
  Declare variables for accessing UI elements
  ***************************************************************/
 const formEl = document.forms["Schedule"],
     createButton = formEl["commit"];
 
 // set up the movie category selection list
 const createWeekSelectEl = formEl.week;
 fillSelectWithOptions(createWeekSelectEl, WeekEL.labels);
 
 /******************************************************************
  Add event listeners for the create/submit button
  ******************************************************************/
 createButton.addEventListener("click", async function () {
     const slots = {
         scheduleId: formEl["scheduleId"].value,
         klassName: formEl["klassName"].value,
         startDate: formEl["startDate"].value,
         endDate: formEl["endDate"].value,
         instructor: formEl["instructor"].value,
         scheduleWeek: formEl["scheduleWeek"].value,
         scheduleTime: formEl["scheduleTime"].value,
         duration: formEl["duration"].value
     };
     await Schedule.add(slots);
     formEl.reset();
 });
 
 
 
 