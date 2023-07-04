/**
 * @fileOverview  View methods for the use case "retrieve and list Persons"
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
import { showProgressBar, hideProgressBar } from "../../lib/util.mjs";

/***************************************************************
 Setup and handle UI Authentication
 ***************************************************************/
 handleAuthentication();


/***************************************************************
 Load data
 ***************************************************************/
const PersonRecords = await Person.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#Persons>tbody");
const selectOrderEl = document.querySelector("main>div>div>label>select");
  progressEl = document.querySelector("progress");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
 async function retrieveAndListAllBooks( order) {
  tableBodyEl.innerHTML = "";
  showProgressBar( progressEl);
  // load all book records using order param
  const bookRecords = await Book.retrieveAll( order);
  // for each Person, create a table row with a cell for each attribute
  for (const PersonRec of PersonRecords) {
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = PersonRec.personId;
    row.insertCell().textContent = PersonRec.personName;
    row.insertCell().textContent = GenderEL.labels[PersonRec.gender - 1];
    row.insertCell().textContent = PersonRec.birthDate;
    row.insertCell().textContent = PersonRec.email;
    row.insertCell().textContent = PersonRec.phoneNumber;
    row.insertCell().textContent = PersonRec.address;
    row.insertCell().textContent = PersonRec.iban;
  }
  hideProgressBar( progressEl);
}
