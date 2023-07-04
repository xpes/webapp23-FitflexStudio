/**
 * @fileOverview  View methods for the use case "delete Person"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import { handleAuthentication } from "./accessControl.mjs";
import Person from "../m/Person.mjs";
import { fillSelectWithOptions, showProgressBar, hideProgressBar } from "../../lib/util.mjs";

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
const formEl = document.forms["Person"],
  deleteButton = formEl["commit"],
  selectPersonEl = formEl["selectPerson"];

/***************************************************************
 Set up select element
 ***************************************************************/
for (const PersonRec of PersonRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = PersonRec.personName;
  optionEl.value = PersonRec.personId;
  selectPersonEl.add(optionEl, null);
}

/***************************************************************
 Set up (choice) widgets
 ***************************************************************/
// set up the person selection list
fillSelectWithOptions( personRecords, selectPersonEl, "personId", "personName");

/******************************************************************
 Add event listeners for the delete/submit button
 ******************************************************************/
// set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
  const personId = selectPersonEl.value;
  if (!personId) return;
  if (confirm("Do you really want to delete this Person record?")) {
    await Person.destroy(personId);
    // remove deleted Person from select options
    selectPersonEl.remove(selectPersonEl.selectedIndex);
  }
});