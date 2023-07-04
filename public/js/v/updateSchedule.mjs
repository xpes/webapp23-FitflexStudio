/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Schedule, { WeekEL } from "../m/Schedule.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const MemberRecords = await Schedule.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Schedule"],
  updateButton = formEl["commit"],
  selectMemberEl = formEl["selectSchedule"];

// set up the gender selection list
fillSelectWithOptions(formEl.scheduleWeek, WeekEL.labels);

/***************************************************************
 Set up select element
 ***************************************************************/
// fill select with options
for (const MemberRec of MemberRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = MemberRec.klassName;
  optionEl.value = MemberRec.scheduleId;
  selectMemberEl.add(optionEl, null);
}
// when a Member is selected, fill the form with its data
selectMemberEl.addEventListener("change", async function () {
  const memberId = selectMemberEl.value;
  if (memberId) {
    // retrieve up-to-date Member record
    const MemberRec = await Schedule.retrieve(memberId);
    formEl["ScheduleId"].value = MemberRec.scheduleId;
    formEl["KlassName"].value = MemberRec.klassName;
    formEl["startDate"].value = MemberRec.startDate;
    formEl["endDate"].value = MemberRec.endDate;
    formEl["instructor"].value = MemberRec.instructor;
    formEl["scheduleWeek"].value = MemberRec.scheduleWeek;
    formEl["scheduleTime"].value = MemberRec.scheduleTime;
    formEl["duration"].value = MemberRec.duration;
  } else {
    formEl.reset();
  }
});

/******************************************************************
 Add event listeners for the update/submit button
 ******************************************************************/
// set an event handler for the update button
updateButton.addEventListener("click", async function () {
  const slots = {
    scheduleId: formEl["ScheduleId"].value,
    klassName: formEl["KlassName"].value,
    startDate: formEl["StartDate"].value,
    endDate: formEl["EndDate"].value,
    instructor: formEl["Instructor"].value,
    scheduleWeek: formEl["ScheduleWeek"].value,
    scheduleTime: formEl["ScheduleTime"].value,
    duration: formEl["Duration"].value
  },
    MemberIdRef = selectMemberEl.value;
  if (!MemberIdRef) return;
  await Schedule.update(slots);
  // update the selection list option element
  selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.scheduleName;
  formEl.reset();
});
