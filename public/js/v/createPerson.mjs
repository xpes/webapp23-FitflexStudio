/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 * @author Nourelhouda Benaida
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL } from "../m/Person.mjs";
import { fillSelectWithOptions, showProgressBar, hideProgressBar } from "../../lib/util.mjs";


/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
    createButton = formEl["commit"];
    progressEl = document.querySelector("progress");

// set up the movie category selection list
const createGenderSelectEl = formEl.gender;
fillSelectWithOptions(createGenderSelectEl, GenderEL.labels);

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
    if (formEl.checkValidity()) {
    await Person.add(slots);
    formEl.reset();
    }
    hideProgressBar( progressEl);
});

// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
  });


