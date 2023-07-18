/**
 * @fileOverview  View methods for the use case "delete Person"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Membership from "../../m/Membership.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const MembershipRecords = await Membership.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Membership"],
    deleteButton = formEl["commit"],
    selectMEmbershipEl = formEl["selectMembership"];
let cancelListener = null;


/***************************************************************
 Set up select element
 ***************************************************************/
for (const MembershipRec of MembershipRecords) {
    const optionEl = document.createElement("option");
    optionEl.text = MembershipRec.membershipName;
    optionEl.value = MembershipRec.membershipId;
    selectMEmbershipEl.add(optionEl, null);
}

/*******************************************************************
 Setup listener on the selected person record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected person record
selectMEmbershipEl.addEventListener("change", async function () {
    const membershipKey = selectMEmbershipEl.value;
    if (membershipKey) {
        // cancel record listener if a previous listener exists
        if (cancelListener) cancelListener();
        // add listener to selected person, returning the function to cancel listener
        cancelListener = await Membership.observeChanges(membershipKey);
    }
});

/******************************************************************
 Add event listeners for the delete/submit button
 ******************************************************************/
// set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
    const membershipId = selectMEmbershipEl.value;
    if (!membershipId) return;
    if (confirm("Do you really want to delete this Membership record?")) {
        await Membership.destroy(membershipId);
        // remove deleted Person from select options
        selectMEmbershipEl.remove(selectMEmbershipEl.selectedIndex);
    }
});