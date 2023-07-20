/**
 * @fileOverview  View methods for the use case "retrieve and list Schedules"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
 import Schedule, { WeekEL } from "../../m/Schedule.mjs";

 /***************************************************************
 Load data
 ***************************************************************/
let order = "scheduleId";
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
const tableBodyEl = document.querySelector("table#Schedules>tbody");

/***************************************************************
 Render list of all Person records
 ***************************************************************/
// for each Person, create a table row with a cell for each attribute
async function createBlock(startAt) {
  console.log("In create block");
  tableBodyEl.innerHTML = "";
  const ScheduleRecords = await Schedule.retrieveBlock({ "order": order, "cursor": startAt });
  if (ScheduleRecords.length) {
    // set page references for current (cursor) page
    cursor = ScheduleRecords[0][order];
    // set next startAt page reference, if not next page, assign "null" value
    nextPageRef = (ScheduleRecords.length < 5) ? null : ScheduleRecords[ScheduleRecords.length - 1][order];
    for (const ScheduleRec of ScheduleRecords) {
      console.log("In for loop " + ScheduleRec);
      const row = tableBodyEl.insertRow();
      row.insertCell().textContent = ScheduleRec.scheduleId;
      row.insertCell().textContent = ScheduleRec.klassName;
      row.insertCell().textContent = ScheduleRec.startDate;
      row.insertCell().textContent = ScheduleRec.endDate;
      row.insertCell().textContent = ScheduleRec.instructor;
      row.insertCell().textContent = WeekEL.labels[ScheduleRec.scheduleWeek - 1];
      row.insertCell().textContent = ScheduleRec.scheduleTime;
      row.insertCell().textContent = ScheduleRec.duration;

    }
  }
}
createBlock();