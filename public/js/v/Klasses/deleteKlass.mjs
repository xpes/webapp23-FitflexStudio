/**
 * @fileOverview  View methods for the use case "delete Klass"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Klass from "../../m/Klass.mjs";

/***************************************************************
 Load data
 ***************************************************************/
const KlassRecords = await Klass.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Klass"],
  deleteButton = formEl["commit"],
  selectKlassEl = formEl["selectKlass"];
let cancelListener = null;


/***************************************************************
 Set up select element
 ***************************************************************/
for (const KlassRec of KlassRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = KlassRec.klassName;
  optionEl.value = KlassRec.klassId;
  selectKlassEl.add(optionEl, null);
}

/*******************************************************************
 Setup listener on the selected klass record synchronising DB with UI
 ******************************************************************/
// set up listener to document changes on selected klass record
selectKlassEl.addEventListener("change", async function () {
  const klassKey = selectKlassEl.value;
  if (klassKey) {
    // cancel record listener if a previous listener exists
    if (cancelListener) cancelListener();
    // add listener to selected klass, returning the function to cancel listener
    cancelListener = await Klass.observeChanges(klassKey);
  }
});

/******************************************************************
 Add event listeners for the delete/submit button
 ******************************************************************/
// set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
  const klassId = selectKlassEl.value;
  if (!klassId) return;
  if (confirm("Do you really want to delete this Klass record?")) {
    await Klass.destroy(klassId);
    // remove deleted Klass from select options
    selectKlassEl.remove(selectKlassEl.selectedIndex);
  }
});