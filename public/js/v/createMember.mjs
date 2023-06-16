/**
 * @fileOverview  View methods for the use case "create Person"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL } from "../m/Person.mjs";

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
    phoneNo: formEl["phoneNo"].value,
    address: formEl["address"].value,
    IBAN: formEl["IBAN"].value,
  };
  await Person.add( slots);
  formEl.reset();
});
