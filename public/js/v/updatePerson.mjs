/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person from "../m/Person.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const MemberRecords = await Person.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
  updateButton = formEl["commit"],
  selectMemberEl = formEl["selectPerson"];

/***************************************************************
 Set up select element
 ***************************************************************/
// fill select with options
for (const MemberRec of MemberRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = MemberRec.personName;
  optionEl.value = MemberRec.personId;
  selectMemberEl.add(optionEl, null);
}
// when a Member is selected, fill the form with its data
selectMemberEl.addEventListener("change", async function () {
  const memberId = selectMemberEl.value;
  if (memberId) {
    // retrieve up-to-date Member record
    const MemberRec = await Person.retrieve(memberId);
    formEl["PersonId"].value = MemberRec.personId;
    formEl["PersonName"].value = MemberRec.personName;
    formEl["gender"].value = MemberRec.gender;
    formEl["birthDate"].value = MemberRec.birthDate;
    formEl["email"].value = MemberRec.email;
    formEl["phoneNo"].value = MemberRec.phoneNumber;
    formEl["address"].value = MemberRec.address;
    formEl["IBAN"].value = MemberRec.iban;
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
    personId: formEl["PersonId"].value,
    personName: formEl["PersonName"].value,
    gender: formEl["gender"].value,
    birthDate: formEl["birthDate"].value,
    email: formEl["email"].value,
    phoneNumber: formEl["phoneNo"].value,
    address: formEl["address"].value,
    iban: formEl["IBAN"].value
  },
    MemberIdRef = selectMemberEl.value;
  if (!MemberIdRef) return;
  await Person.update(slots);
  // update the selection list option element
  selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.memberName;
  formEl.reset();
});
