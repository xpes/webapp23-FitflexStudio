/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import { handleAuthentication } from "./accessControl.mjs";
import Person, { GenderEL } from "../m/Person.mjs";
import { fillSelectWithOptions, showProgressBar, hideProgressBar } from "../../lib/util.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
 handleAuthentication();

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

// set up the gender selection list
fillSelectWithOptions(formEl.gender, GenderEL.labels);

/***************************************************************
 Add event listeners for responsive validation
 ***************************************************************/
// add event listeners for responsive validation
formEl["personId"].addEventListener("input", function () {
  // do not yet check the ID constraint, only before commit
  formEl["personId"].setCustomValidity( Person.checkPersonId( formEl["personId"].value).message);
});
formEl["personName"].addEventListener("input", function () {
  formEl["personName"].setCustomValidity( Person.checkPersonName( formEl["personName"].value).message);
});
/*formEl["gender"].addEventListener("input", function () {
  formEl["gender"].setCustomValidity( Person.checkGender( formEl["gender"].value).message);
});*/
formEl["birthDate"].addEventListener("input", function () {
  formEl["birthDate"].setCustomValidity( Person.checkBirthDate( formEl["birthDate"].value).message);
});
formEl["email"].addEventListener("input", function () {
  formEl["email"].setCustomValidity( Person.checkEmail( formEl["email"].value).message);
});
formEl["phoneNo"].addEventListener("input", function () {
  formEl["phoneNO"].setCustomValidity( Person.checkPhoneNo( formEl["phoneNo"].value).message);
});  
formEl["address"].addEventListener("input", function () {
  formEl["address"].setCustomValidity( Person.checkAddress( formEl["address"].value).message);
});
formEl["iban"].addEventListener("input", function () {
  formEl["IBAN"].setCustomValidity( Person.checkPhoneNo( formEl["phoneNo"].value).message);
});  

//________________________________________Should we write the Set Up choice widgets as in the example code ???
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
  selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.personName;
  formEl.reset();
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
});