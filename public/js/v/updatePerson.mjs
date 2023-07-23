/**
 * @fileOverview  View methods for the use case "update Member"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL } from "../m/Person.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../lib/util.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const MemberRecords = await Person.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
  updateButton = formEl["commit"],
  selectMemberEl = formEl.selectPerson;
let cancelListener = null;
// set up the gender selection list
fillSelectWithOptions(formEl.gender, GenderEL.labels);

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
  if (cancelListener) cancelListener();
  const memberId = selectMemberEl.value;
  if (memberId) {
    // retrieve up-to-date person record
    cancelListener = await Person.observeChanges(memberId);
    const personRecord = await Person.retrieve(memberId);
    for (const field of ["personId", "personName", "gender", "birthDate", "email", "phoneNumber", "address", "iban"]) {
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
    iban: formEl["iban"].value
  },
    MemberIdRef = selectMemberEl.value;
  // set error messages in case of constraint violations
  formEl["personName"].addEventListener("input", function () {
    formEl["personName"].setCustomValidity(Person.checkPersonName(formEl["personName"].value).message);
  });
  formEl["gender"].addEventListener("input", function () {
    formEl["gender"].setCustomValidity(Person.checkGender(formEl["gender"].value).message);
  });
  formEl["birthDate"].addEventListener("input", function () {
    formEl["birthDate"].setCustomValidity(Person.checkBirthDate(formEl["birthDate"].value).message);
  });

  formEl["email"].addEventListener("input", function () {
    formEl["email"].setCustomValidity(Person.checkEmail(formEl["email"].value).message);
  });

  formEl["phoneNumber"].addEventListener("input", function () {
    formEl["phoneNumber"].setCustomValidity(Person.checkPhoneNumber(formEl["phoneNumber"].value).message);
  });

  formEl["address"].addEventListener("input", function () {
    formEl["address"].setCustomValidity(Person.checkAddress(formEl["address"].value).message);
  });
  formEl["iban"].addEventListener("input", function () {
    formEl["iban"].setCustomValidity(Person.checkIban(formEl["iban"].value).message);
  });

  if (!MemberIdRef) return;
  if (formEl.checkValidity()) {
    Person.update(slots);
    // update the selection list option element
    selectMemberEl.options[selectMemberEl.selectedIndex].text = slots.personName;
    formEl.reset();
  }
});