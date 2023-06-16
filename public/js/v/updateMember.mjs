/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Member from "../m/Member.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const MemberRecords = await Member.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Member"],
  updateButton = formEl["commit"],
  selectMemberEl = formEl["selectMember"];

/***************************************************************
 Set up select element
 ***************************************************************/
// fill select with options
for (const MemberRec of MemberRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = MemberRec.memberName;
  optionEl.value = MemberRec.memberId;
  selectMemberEl.add( optionEl, null);
}
// when a Member is selected, fill the form with its data
selectMemberEl.addEventListener("change", async function () {
  const memberId = selectMemberEl.value;
  if (memberId) {
    // retrieve up-to-date Member record
    const MemberRec = await Member.retrieve( memberId);
    formEl["memberId"].value = MemberRec.memberId;
    formEl["memberName"].value = MemberRec.memberName;
    formEl["birthDate"].value = MemberRec.birthDate;
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
    memberId: formEl["memberId"].value,
    memberName: formEl["memberName"].value,
    birthDate: formEl["birthDate"].value
  },
    MemberIdRef = selectMemberEl.value;
  if (!MemberIdRef) return;
  await Member.update( slots);
  // update the selection list option element
  selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.memberName;
  formEl.reset();
});
