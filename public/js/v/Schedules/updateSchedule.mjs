/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import Schedule, { WeekEL } from "../../m/Schedule.mjs";
 import { fillSelectWithOptions } from "../../../lib/util.mjs";
 import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";
 
 /***************************************************************
  Load data
  ***************************************************************/
 const MemberRecords = await Schedule.retrieveAll();
 
 /***************************************************************
  Declare variables for accessing UI elements
  ***************************************************************/
 const formEl = document.forms["Schedule"],
   updateButton = formEl["commit"],
   selectMemberEl = formEl.selectSchedule;
 let cancelListener = null;
 // set up the gender selection list
 fillSelectWithOptions(formEl.scheduleWeek, WeekEL.labels);
 
 // add event listeners for responsive validation
 formEl["klassName"].addEventListener("input", function () {
   formEl["klassName"].setCustomValidity(Schedule.checkKlassName(formEl["klassName"].value).message);
   formEl["klassName"].reportValidity();
 });
 formEl["instructor"].addEventListener("input", function () {
   formEl["instructor"].setCustomValidity(Schedule.checkInstructor(formEl["instructor"].value).message);
   formEl["instructor"].reportValidity();
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
 
 
 /***************************************************************
  Set up select element
  ***************************************************************/
 // fill select with options
 for (const MemberRec of MemberRecords) {
   console.log("selection " + MemberRec.ScheduleId);
   const optionEl = document.createElement("option");
   optionEl.text = MemberRec.KlassName;
   optionEl.value = MemberRec.ScheduleId;
   selectMemberEl.add(optionEl, null);
 }
 // when a Member is selected, fill the form with its data
 selectMemberEl.addEventListener("change", async function () {
   if (cancelListener) cancelListener();
   const memberId = selectMemberEl.value;
   if (memberId) {
     // retrieve up-to-date Schedule record
     cancelListener = await Schedule.observeChanges(memberId);
     const ScheduleRecord = await Schedule.retrieve(memberId);
     for (const field of ["ScheduleId", "klassName", "instructor", "scheduleWeek", "scheduleTime", "duration"]) {
       formEl[field].value = ScheduleRecord[field] !== undefined ? ScheduleRecord[field] : "";
       // delete custom validation error message which may have been set before
       formEl[field].setCustomValidity("");
     }
   } else {
     formEl.reset();
   }
 });
 
 /******************************************************************
  Add event listeners for the update/submit button
  ******************************************************************/
 // set an event handler for the update button
 updateButton.addEventListener("click", async function () {
   if (cancelListener) cancelListener();
   const formEl = document.forms["Schedule"];
   const slots = {
     ScheduleId: formEl["ScheduleId"].value,
     klassName: formEl["klassName"].value,
     instructor: formEl["instructor"].value,
     scheduleWeek: formEl["scheduleWeek"].value,
     scheduleTime: formEl["scheduleTime"].value,
     duration: formEl["duration"].value
   },

     MemberIdRef = selectMemberEl.value;
   // set error messages in case of constraint violations
   formEl["klassName"].addEventListener("input", function () {
     formEl["klassName"].setCustomValidity(Schedule.checkKlassName(formEl["klassName"].value).message);
   });
   formEl["instructor"].addEventListener("input", function () {
     formEl["instructor"].setCustomValidity(Schedule.checkInstructor(formEl["instructor"].value).message);
   });
   formEl["scheduleWeek"].addEventListener("input", function () {
     formEl["scheduleWeek"].setCustomValidity(Schedule.checkScheduleWeek(formEl["scheduleWeek"].value).message);
   });
 
   formEl["scheduleTime"].addEventListener("input", function () {
     formEl["scheduleTime"].setCustomValidity(Schedule.checkScheduleTime(formEl["scheduleTime"].value).message);
   });
 
   formEl["duration"].addEventListener("input", function () {
     formEl["duration"].setCustomValidity(Schedule.checkDuration(formEl["duration"].value).message);
   });
 
 
   if (!MemberIdRef) return;
   if (formEl.checkValidity()) {
     Schedule.update(slots);
     // update the selection list option element
     selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.klassName;
     formEl.reset();
   }
 });
 