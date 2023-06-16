/**
 * @fileOverview  View methods for the use case "delete Person"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person from "../m/Person.mjs";

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
  selectPersonEl.add( optionEl, null);
}

/******************************************************************
 Add event listeners for the delete/submit button
 ******************************************************************/
// set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
  const personId = selectPersonEl.value;
  if (!personId) return;
  if (confirm("Do you really want to delete this Person record?")) {
    await Person.destroy( personId);
    // remove deleted Person from select options
    selectPersonEl.remove( selectPersonEl.selectedIndex);
  }
});