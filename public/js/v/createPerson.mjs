/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 * @author NourElhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL } from "../m/Person.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
    createButton = formEl["commit"];

// set up the movie category selection list
const createGenderSelectEl = formEl.gender;
fillSelectWithOptions(createGenderSelectEl, GenderEL.labels);

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
        phoneNumber: formEl["phoneNo"].value,
        address: formEl["address"].value,
        iban: formEl["IBAN"].value
    };
    await Person.add(slots);
    formEl.reset();
});



