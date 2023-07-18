/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL, PersonRoleEL } from "../../m/Person.mjs";
import Membership from "../../m/Membership.mjs";
import { fillSelectWithOptions } from "../../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";
import { undisplayAllSegmentFields, displaySegmentFields } from "../../c/app.mjs"

/***************************************************************
 Load data
 ***************************************************************/
const MemberRecords = await Person.retrieveAll();
const MembershipRecords = await Membership.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
  updateButton = formEl["commit"],
  selectMembershipTypeEl = formEl.membershipType,
  selectMemberEl = formEl.selectPerson;
let cancelListener = null;
// set up the gender selection list
fillSelectWithOptions(formEl.gender, GenderEL.labels);
fillSelectWithOptions(formEl.role, PersonRoleEL.labels);

// fill select with options
const optionEl = document.createElement("option");
optionEl.text = "---";
optionEl.value = 0;
for (const MemberRec of MemberRecords) {
  console.log("selection " + MemberRec.personId);
  const optionEl = document.createElement("option");
  optionEl.text = MemberRec.personName;
  optionEl.value = MemberRec.personId;
  selectMemberEl.add(optionEl, null);
}

// fill select membershipType with options
const optionEl2 = document.createElement("option");
optionEl2.text = "---";
optionEl2.value = 0;
selectMembershipTypeEl.add(optionEl2, null);
for (const MembershipRec of MembershipRecords) {
  console.log("selection " + MembershipRec.membershipId);
  const optionEl2 = document.createElement("option");
  optionEl2.text = MembershipRec.membershipName;
  optionEl2.value = MembershipRec.membershipId;
  selectMembershipTypeEl.add(optionEl2, null);
}

/**
 * event handler for role selection events
 */
function handleCategorySelectChangeEvent(e) {
  var formEl, categoryIndexStr;
  if (e) {
    formEl = e.currentTarget.form;
  }
  else {
    formEl = document.forms["Person"];
  }
  // the array index of PersonRoleEL.labels
  categoryIndexStr = formEl.role.value;
  console.log(formEl["role"].value);
  if (categoryIndexStr) {
    displaySegmentFields(formEl, PersonRoleEL.labels,
      parseInt(categoryIndexStr));
  } else {
    undisplayAllSegmentFields(formEl, PersonRoleEL.labels);
  }
}

/**********************************************
 * Refresh the Create person UI
 **********************************************/
var subClassProp = document.getElementsByClassName("field");
console.log(subClassProp.length);
for (let i = 0; i < subClassProp.length; i++) {
  subClassProp[i].style.display = "none";
}

// add event listeners for responsive validation
formEl["personName"].addEventListener("input", function () {
  formEl["personName"].setCustomValidity(Person.checkPersonName(formEl["personName"].value).message);
  formEl["personName"].reportValidity();
});
formEl["gender"].addEventListener("input", function () {
  formEl["gender"].setCustomValidity(Person.checkGender(formEl["gender"].value).message);
  formEl["gender"].reportValidity();
});
formEl["birthDate"].addEventListener("input", function () {
  formEl["birthDate"].setCustomValidity(Person.checkBirthDate(formEl["birthDate"].value).message);
  formEl["birthDate"].reportValidity();
});

formEl["email"].addEventListener("input", function () {
  formEl["email"].setCustomValidity(Person.checkEmail(formEl["email"].value).message);
  formEl["email"].reportValidity();
});

formEl["phoneNumber"].addEventListener("input", function () {
  formEl["phoneNumber"].setCustomValidity(Person.checkPhoneNumber(formEl["phoneNumber"].value).message);
  formEl["phoneNumber"].reportValidity();
});

formEl["address"].addEventListener("input", function () {
  formEl["address"].setCustomValidity(Person.checkAddress(formEl["address"].value).message);
  formEl["address"].reportValidity();
});
formEl["iban"].addEventListener("input", function () {
  formEl["iban"].setCustomValidity(Person.checkIban(formEl["iban"].value).message);
  formEl["iban"].reportValidity();
});
formEl["role"].addEventListener("change", handleCategorySelectChangeEvent);

formEl["trainerId"].addEventListener("input", function () {
  formEl["trainerId"].setCustomValidity(Person.checkTrainerId(formEl["trainerId"].value, formEl["role"].value).message);
  formEl["trainerId"].reportValidity();
});
formEl["trainerCategory"].addEventListener("input", function () {
  formEl["trainerCategory"].setCustomValidity(Person.checkTrainerCategory(formEl["trainerCategory"].value, formEl["role"].value).message);
  formEl["trainerCategory"].reportValidity();
});
formEl["memberId"].addEventListener("input", function () {
  formEl["memberId"].setCustomValidity(Person.checkMemberId(formEl["memberId"].value, formEl["role"].value).message);
  formEl["memberId"].reportValidity();
});
formEl["membershipType"].addEventListener("input", function () {
  formEl["membershipType"].setCustomValidity(Person.checkMembershipType(formEl["membershipType"].value, formEl["role"].value).message);
  formEl["membershipType"].reportValidity();
});

/***************************************************************
 Set up select element
 ***************************************************************/

// when a Member is selected, fill the form with its data
selectMemberEl.addEventListener("change", async function () {
  let membership = null;
  if (cancelListener) cancelListener();
  const memberId = selectMemberEl.value;
  if (memberId) {
    // retrieve up-to-date person record
    cancelListener = await Person.observeChanges(memberId);
    const personRecord = await Person.retrieve(memberId);
    for (const field of ["personId", "personName", "gender", "birthDate", "email", "phoneNumber", "address", "iban", "role", "trainerId", "trainerCategory", "memberId", "membershipType"]) {
      if (field === "role") {
        formEl[field].value = [personRecord[field]];
        handleCategorySelectChangeEvent();
      }
      else if (field === "membershipType") {
        formEl[field].value = personRecord[field];
      }
      else
        formEl[field].value = personRecord[field] !== undefined ? personRecord[field] : "";
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
  const formEl = document.forms["Person"];
  const slots = {
    personId: formEl["personId"].value,
    personName: formEl["personName"].value,
    gender: formEl["gender"].value,
    birthDate: formEl["birthDate"].value,
    email: formEl["email"].value,
    phoneNumber: formEl["phoneNumber"].value,
    address: formEl["address"].value,
    iban: formEl["iban"].value,
    role: formEl["role"].value,
    trainerId: formEl["trainerId"].value,
    trainerCategory: formEl["trainerCategory"].value,
    memberId: formEl["memberId"].value,
    membershipType: formEl["membershipType"].value
  },
    MemberIdRef = selectMemberEl.value;
  // set error messages in case of constraint violations
  formEl["personName"].setCustomValidity(Person.checkPersonName(slots.personName).message);
  formEl["gender"].setCustomValidity(Person.checkGender(slots.gender).message);
  formEl["birthDate"].setCustomValidity(Person.checkBirthDate(slots.birthDate).message);
  formEl["email"].setCustomValidity(Person.checkEmail(slots.email).message);
  formEl["phoneNumber"].setCustomValidity(Person.checkPhoneNumber(slots.phoneNumber).message);
  formEl["address"].setCustomValidity(Person.checkAddress(slots.address).message);
  formEl["iban"].setCustomValidity(Person.checkIban(slots.iban).message);
  formEl["trainerId"].setCustomValidity(Person.checkTrainerId(slots.trainerId, slots.role).message);
  formEl["trainerCategory"].setCustomValidity(Person.checkTrainerCategory(slots.trainerCategory, slots.role).message);
  formEl["memberId"].setCustomValidity(Person.checkMemberId(slots.memberId, slots.role).message);
  formEl["membershipType"].setCustomValidity(Person.checkMembershipType(slots.membershipType, slots.role).message);

  if (!MemberIdRef) return;
  if (formEl.checkValidity()) {
    console.log(slots);
    Person.update(slots);
    // update the selection list option element
    selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.personName;
    formEl.reset();
  }
});
