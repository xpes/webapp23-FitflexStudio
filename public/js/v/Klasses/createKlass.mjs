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
    formEl["klassId"].reportValidity();
});
formEl["klassName"].addEventListener("input", function () {
    formEl["klassName"].setCustomValidity(Klass.checkKlassName(formEl["klassName"].value).message);
    formEl["klassName"].reportValidity();
});
formEl["instructor"].addEventListener("input", function () {
    formEl["instructor"].setCustomValidity(Klass.checkInstructor(formEl["instructor"].value).message);
    formEl["instructor"].reportValidity();
});
formEl["startDate"].addEventListener("input", function () {
    formEl["startDate"].setCustomValidity(Klass.checkStartDate(formEl["startDate"].value).message);
    formEl["startDate"].reportValidity();
});
formEl["capacity"].addEventListener("input", function () {
    formEl["capacity"].setCustomValidity(Klass.checkCapacity(formEl["capacity"].value).message);
    formEl["capacity"].reportValidity();
});
formEl["registeredMember"].addEventListener("input", function () {
    formEl["registeredMember"].setCustomValidity(Klass.checkRegisteredMember(formEl["registeredMember"].value).message);
    formEl["registeredMember"].reportValidity();
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
        capacity: formEl["capacity"].value,
        registeredMember: formEl["registeredMember"].value,

    };
    // check constraints and set error messages
    showProgressBar(progressEl);
    formEl["klassId"].setCustomValidity((await Klass.checkKlassIdAsId(slots.klassId)).message);
    formEl["klassName"].setCustomValidity(Klass.checkKlassName(slots.klassName).message);
    formEl["instructor"].setCustomValidity(Klass.checkInstructor(slots.gender).message);
    formEl["startDate"].setCustomValidity(Klass.checkStartDate(slots.startDate).message);
    formEl["capacity"].setCustomValidity(Klass.checkCapacity(slots.capacity).message);
    formEl["registeredMember"].setCustomValidity(Klass.checkRegisteredMember(slots.registeredMember).message);

    if (formEl.checkValidity()) {
        await Klass.add(slots);
        formEl.reset();
    }
    hideProgressBar(progressEl);
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});



