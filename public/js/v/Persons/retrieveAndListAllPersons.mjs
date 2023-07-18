/**
 * @fileOverview  View methods for the use case "retrieve and list Persons"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Membership from "../../m/Membership.mjs";
import Person, { GenderEL, PersonRoleEL, TrainerCategoryEL } from "../../m/Person.mjs";
//import { fsDb } from "../initFirebase.mjs";
/*import { doc as fsDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

/***************************************************************
 Load data
 ***************************************************************/
let order = "personId";
const orderSectionEl = document.getElementById("order"),
  selectOrderEl = orderSectionEl.querySelector("div > label > select");
let cursor = null,
  startAt = null,
  previousPageRef = null,
  nextPageRef = null,
  startAtRefs = [];
const previousBtnEl = document.getElementById("previousPage"),
  nextBtnEl = document.getElementById("nextPage");
startAtRefs.push(cursor);
previousBtnEl.disabled = true;
//const MembershipRecords = await Membership.retrieveAll();

/**
 * "Previous" button
 */
previousBtnEl.addEventListener("click", async function () {
  // locate current page reference in index of page references
  previousPageRef = startAtRefs[startAtRefs.indexOf(cursor) - 1];
  // create new page
  await createBlock(previousPageRef);
  // disable "previous" button if cursor is first page
  if (cursor === startAtRefs[0]) previousBtnEl.disabled = true;
  // enable "next" button if cursor is not last page
  if (cursor !== startAtRefs[startAtRefs.length - 1]) nextBtnEl.disabled = false;
});
/**
 *  "Next" button
 */
nextBtnEl.addEventListener("click", async function () {
  await createBlock(nextPageRef);
  // add new page reference if not present in index
  if (!startAtRefs.find(i => i === cursor)) startAtRefs.push(cursor);
  // disable "next" button if cursor is last page
  if (!nextPageRef) nextBtnEl.disabled = true;
  // enable "previous" button if cursor is not first page
  if (cursor !== startAtRefs[0]) previousBtnEl.disabled = false;
});
/**
 * handle order selection events: when an order is selected,
 * populate the list according to the selected order
 */
selectOrderEl.addEventListener("change", async function (e) {
  order = e.target.value;
  startAtRefs = [];
  await createBlock();
  startAtRefs.push(cursor);
  previousBtnEl.disabled = true;
  nextBtnEl.disabled = false;
});

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const tableBodyEl = document.querySelector("table#Persons>tbody");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
// for each Person, create a table row with a cell for each attribute
async function createBlock(startAt) {
  console.log("In create block");
  tableBodyEl.innerHTML = "";
  const PersonRecords = await Person.retrieveBlock({ "order": order, "cursor": startAt });
  if (PersonRecords.length) {
    // set page references for current (cursor) page
    cursor = PersonRecords[0][order];
    // set next startAt page reference, if not next page, assign "null" value
    nextPageRef = (PersonRecords.length < 5) ? null : PersonRecords[PersonRecords.length - 1][order];
    for (const PersonRec of PersonRecords) {
      let membership = null;
      console.log("In for loop " + PersonRec);
      const row = tableBodyEl.insertRow();
      row.insertCell().textContent = PersonRec.personId;
      row.insertCell().textContent = PersonRec.personName;
      row.insertCell().textContent = GenderEL.labels[PersonRec.gender - 1];
      row.insertCell().textContent = PersonRec.birthDate;
      row.insertCell().textContent = PersonRec.email;
      row.insertCell().textContent = PersonRec.phoneNumber;
      row.insertCell().textContent = PersonRec.address;
      row.insertCell().textContent = PersonRec.iban;
      row.insertCell().textContent = PersonRoleEL.labels[PersonRec.role - 1];
      row.insertCell().textContent = PersonRec.trainerId;
      row.insertCell().textContent = TrainerCategoryEL.labels[PersonRec.trainerCategory - 1];
      row.insertCell().textContent = PersonRec.memberId;
      if (PersonRec.membershipType) {
        membership = await Membership.retrieve(PersonRec.membershipType);
        row.insertCell().textContent = membership.membershipName;
        console.log("In membership type " + membership);
      }
    }
  }
}
createBlock();
