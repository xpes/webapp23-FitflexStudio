/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL } from "../m/Person.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../lib/util.mjs";


/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
    createButton = formEl["commit"],
    progressEl = document.querySelector("progress");

// set up the movie category selection list
const createGenderSelectEl = formEl.gender;
fillSelectWithOptions(createGenderSelectEl, GenderEL.labels);

// add event listeners for responsive validation
formEl["personId"].addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl["personId"].setCustomValidity(Person.checkPersonId(formEl["personId"].value).message);
    formEl["personId"].reportValidity();
});
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
formEl["IBAN"].addEventListener("input", function () {
    formEl["IBAN"].setCustomValidity(Person.checkIban(formEl["IBAN"].value).message);
    formEl["IBAN"].reportValidity();
});

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
    const slots = {
        personId: formEl["personId"].value,
        personName: formEl["personName"].value,
        gender: formEl["gender"].value,
        birthDate: formEl["birthDate"].value,
        email: formEl["email"].value,
        phoneNumber: formEl["phoneNumber"].value,
        address: formEl["address"].value,
        iban: formEl["IBAN"].value
    };
    // check constraints and set error messages
    showProgressBar(progressEl);
    formEl["personId"].setCustomValidity((await Person.checkPersonIdAsId(slots.personId)).message);
    formEl["personName"].setCustomValidity(Person.checkPersonName(slots.personName).message);
    formEl["gender"].setCustomValidity(Person.checkGender(slots.gender).message);
    formEl["birthDate"].setCustomValidity(Person.checkBirthDate(slots.birthDate).message);
    formEl["email"].setCustomValidity(Person.checkEmail(slots.email).message);
    formEl["phoneNumber"].setCustomValidity(Person.checkPhoneNumber(slots.phoneNumber).message);
    formEl["address"].setCustomValidity(Person.checkAddress(slots.address).message);
    formEl["IBAN"].setCustomValidity(Person.checkIban(slots.iban).message);
    if (formEl.checkValidity()) {
        await Person.add(slots);
        formEl.reset();
    }
    hideProgressBar(progressEl);
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});



