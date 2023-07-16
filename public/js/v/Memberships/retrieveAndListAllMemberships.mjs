/**
 * @fileOverview  View methods for the use case "retrieve and list Persons"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Membership, { PlanEL, ServiceEL } from "../../m/Membership.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const membershipRecords = await Membership.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#Memberships>tbody");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
// for each Person, create a table row with a cell for each attribute
for (const membershipRec of membershipRecords) {
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = membershipRec.membershipId;
    row.insertCell().textContent = membershipRec.membershipName;
    row.insertCell().textContent = membershipRec.price;
    row.insertCell().textContent = PlanEL.labels[membershipRec.duration - 1];
    row.insertCell().textContent = ServiceEL.labels[membershipRec.membershipAccess - 1];
}
