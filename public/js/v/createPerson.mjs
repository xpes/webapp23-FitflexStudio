/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person from "../m/Person.mjs";

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
    createButton = formEl["commit"];

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
