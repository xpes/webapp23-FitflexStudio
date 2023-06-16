/**
 * @fileOverview  View methods for the use case "retrieve and list Persons"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL } from "../m/Person.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const PersonRecords = await Person.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#Persons>tbody");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
// for each Person, create a table row with a cell for each attribute
for (const PersonRec of PersonRecords) {
  const row = tableBodyEl.insertRow();
  row.insertCell().textContent = PersonRec.personId;
  row.insertCell().textContent = PersonRec.personName;
  row.insertCell().textContent = GenderEL.stringify(person.gender);
  row.insertCell().textContent = PersonRec.birthDate;
  row.insertCell().textContent = PersonRec.email;
  row.insertCell().textContent = PersonRec.phoneNo;
  row.insertCell().textContent = PersonRec.address;
  row.insertCell().textContent = PersonRec.iban;

}
