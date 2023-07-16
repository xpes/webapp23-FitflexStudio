/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Klass from "../../m/Klass.mjs";
import { fillSelectWithOptions } from "../../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";


/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Klass"],
    createButton = formEl["commit"],
    progressEl = document.querySelector("progress");

// // set up the movie category selection list
// const createGenderSelectEl = formEl.gender;
// fillSelectWithOptions(createGenderSelectEl, GenderEL.labels);

// add event listeners for responsive validation
formEl["klassId"].addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl["klassId"].setCustomValidity(Klass.checkKlassId(formEl["klassId"].value).message);
});
formEl["klassName"].addEventListener("input", function () {
    formEl["klassName"].setCustomValidity(Klass.checkKlassName(formEl["klassName"].value).message);
});
formEl["instructor"].addEventListener("input", function () {
    formEl["instructor"].setCustomValidity(Klass.checkInstructor(formEl["instructor"].value).message);
});
formEl["startDate"].addEventListener("input", function () {
    formEl["startDate"].setCustomValidity(Klass.checkStartDate(formEl["startDate"].value).message);
});
formEl["endDate"].addEventListener("input", function () {
    formEl["endDate"].setCustomValidity(Klass.checkEndDate(formEl["endDate"].value).message);
});
formEl["capacity"].addEventListener("input", function () {
    formEl["capacity"].setCustomValidity(Klass.checkCapacity(formEl["capacity"].value).message);
});
formEl["registeredMembers"].addEventListener("input", function () {
    formEl["registeredMembers"].setCustomValidity(Klass.checkRegisteredMembers(formEl["registeredMembers"].value).message);
});


/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
    const slots = {
        klassId: formEl["klassId"].value,
        klassName: formEl["klassName"].value,
        instructor: formEl["instructor"].value,
        startDate: formEl["startDate"].value,
        endDate: formEl["endDate"].value,
        capaity: formEl["capacity"].value,
        registeredMember: formEl["registeredMember"].value,

    };
    // check constraints and set error messages
    showProgressBar(progressEl);
    formEl["klassId"].setCustomValidity((await Klass.checkKlassIdAsId(slots.klassId)).message);
    formEl["klassName"].setCustomValidity(Klass.checkPersonName(slots.klassName).message);
    formEl["instructor"].setCustomValidity(Klass.checkGender(slots.gender).message);
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



