/**
 * @fileOverview  View methods for the use case "retrieve and list Persons"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Klass from "../../m/Klass.mjs";
import Person from "../../m/Person.mjs";

/***************************************************************
 Load data
 ***************************************************************/
let order = "klassId";
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
const tableBodyEl = document.querySelector("table#Klasses>tbody");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
// for each Person, create a table row with a cell for each attribute
async function createBlock(startAt) {
  console.log("In create block");
  tableBodyEl.innerHTML = "";
  const KlassRecords = await Klass.retrieveBlock({ "order": order, "cursor": startAt });
  console.log(KlassRecords);
  if (KlassRecords.length) {
    // set page references for current (cursor) page
    cursor = KlassRecords[0][order];
    // set next startAt page reference, if not next page, assign "null" value
    nextPageRef = (KlassRecords.length < 5) ? null : KlassRecords[KlassRecords.length - 1][order];
    for (const KlassRec of KlassRecords) {
      console.log("In for loop " + KlassRec);
      const row = tableBodyEl.insertRow();
      row.insertCell().textContent = KlassRec.klassId;
      row.insertCell().textContent = KlassRec.klassName;
      row.insertCell().textContent = KlassRec.instructor;
      row.insertCell().textContent = KlassRec.startDate;
      row.insertCell().textContent = KlassRec.capacity;
      row.insertCell().textContent = KlassRec.registeredMember;
    }
  }
}
createBlock();