/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Klass, { WeekEL } from "../../m/Klass.mjs";
import { fillSelectWithOptions } from "../../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const MemberRecords = await Klass.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Klass"],
  updateButton = formEl["commit"],
  selectMemberEl = formEl.selectKlass;
let cancelListener = null;
// set up the gender selection list
//fillSelectWithOptions(formEl.gender, GenderEL.labels);
fillSelectWithOptions(formEl.scheduleWeek, WeekEL.labels);

// add event listeners for responsive validation
formEl["klassName"].addEventListener("input", function () {
  formEl["klassName"].setCustomValidity(Klass.checkKlassName(formEl["klassName"].value).message);
  formEl["klassName"].reportValidity();
});

//  formEl["instructor"].addEventListener("input", function () {
//    formEl["instructor"].setCustomValidity(Klass.checkInstructor(formEl["instructor"].value).message);
//    formEl["instructor"].reportValidity();
//  });

formEl["startDate"].addEventListener("input", function () {
  formEl["startDate"].setCustomValidity(Klass.checkStartDate(formEl["startDate"].value).message);
  formEl["startDate"].reportValidity();
});

formEl["endDate"].addEventListener("input", function () {
  formEl["endDate"].setCustomValidity(Klass.checkEndDate(formEl["endDate"].value).message);
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

//  formEl["registeredMember"].addEventListener("input", function () {
//    formEl["registeredMember"].setCustomValidity(Klass.checkRegisteredMember(formEl["registeredMember"].value).message);
//    formEl["registeredMember"].reportValidity();
//  });

/***************************************************************
 Set up select element
 ***************************************************************/
// fill select with options
for (const MemberRec of MemberRecords) {
  console.log("selection " + MemberRec.personId);
  const optionEl = document.createElement("option");
  optionEl.text = MemberRec.klassName;
  optionEl.value = MemberRec.klassId;
  selectMemberEl.add(optionEl, null);
}
// when a Member is selected, fill the form with its data
selectMemberEl.addEventListener("change", async function () {
  if (cancelListener) cancelListener();
  const memberId = selectMemberEl.value;
  if (memberId) {
    // retrieve up-to-date person record
    cancelListener = await Klass.observeChanges(memberId);
    const klassRecord = await Klass.retrieve(memberId);
    for (const field of ["klassId", "klassName", "startDate", "endDate", "capacity", "scheduleWeek", "scheduleTime", "duration"]) {
      formEl[field].value = klassRecord[field] !== undefined ? klassRecord[field] : "";
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
  const formEl = document.forms["Klass"];
  const slots = {
    klassId: formEl["klassId"].value,
    klassName: formEl["klassName"].value,
    // instructor: formEl["instructor"].value,
    startDate: formEl["startDate"].value,
    endDate: formEl["endDate"].value,
    capacity: formEl["capacity"].value,
    scheduleWeek: formEl["scheduleWeek"].value,
    scheduleTime: formEl["scheduleTime"].value,
    duration: formEl["duration"].value
    // registeredMember: formEl["registeredMember"].value
  },
    MemberIdRef = selectMemberEl.value;
  // set error messages in case of constraint violations
  formEl["klassName"].addEventListener("input", function () {
    formEl["klassName"].setCustomValidity(Klass.checkKlassName(formEl["klassName"].value).message);
  });
  // formEl["instructor"].addEventListener("input", function () {
  //   formEl["instructor"].setCustomValidity(Klass.checkInstructor(formEl["instructor"].value).message);
  // });
  formEl["startDate"].addEventListener("input", function () {
    formEl["startDate"].setCustomValidity(Klass.checkStartDate(formEl["startDate"].value).message);
  });
  formEl["endDate"].addEventListener("input", function () {
    formEl["endDate"].setCustomValidity(Klass.checkEndDate(formEl["endDate"].value).message);
  });
  formEl["capacity"].addEventListener("input", function () {
    formEl["capacity"].setCustomValidity(Klass.checkCapacity(formEl["capacity"].value).message);
  });
  formEl["scheduleWeek"].addEventListener("input", function () {
    formEl["scheduleWeek"].setCustomValidity(Klass.checkScheduleWeek(formEl["scheduleWeek"].value).message);
  });

  formEl["scheduleTime"].addEventListener("input", function () {
    formEl["scheduleTime"].setCustomValidity(Klass.checkScheduleTime(formEl["scheduleTime"].value).message);
  });

  formEl["duration"].addEventListener("input", function () {
    formEl["duration"].setCustomValidity(Klass.checkDuration(formEl["duration"].value).message);
  });
  // formEl["registeredMember"].addEventListener("input", function () {
  //   formEl["registeredMember"].setCustomValidity(Klass.checkRegisteredMember(formEl["registeredMember"].value).message);
  // });


  if (!MemberIdRef) return;
  if (formEl.checkValidity()) {
    Klass.update(slots);
    // update the selection list option element
    selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.klassName;
    formEl.reset();
  }
});