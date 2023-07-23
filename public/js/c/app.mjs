/**
 * @fileOverview  App-level controller code
 * @author Elias George
 */
import Person from "../m/Person.mjs";
import Klass from "../m/Klass.mjs";
import Membership from "../m/Membership.mjs";

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
function generateTestData() {
  console.log("In generate data clicked");
  try {
    console.log("In generate data clicked");
    Klass.generateTestData();
    Membership.generateTestData();
    Person.generateTestData();
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
}
/**
 * Clear data
 */
function clearData() {
  if (confirm("Do you really want to delete the entire database?")) {
    try {
      Klass.clearData();
      Membership.clearData();
      Person.clearData();
      console.log("All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
}

/**
 *  Undisplay all form fields classified with a Book segment name
 *  from BookCategoryEL.labels
 */
function undisplayAllSegmentFields(domNode, segmentNames) {
  if (!domNode) domNode = document;  // normally invoked for a form element
  for (const segmentName of segmentNames) {
    const fields = domNode.getElementsByClassName(segmentName);
    for (const el of fields) {
      el.style.display = "none";
    }
  }
}
/**
 *  Display the form fields classified with a Book segment name
 *  from BookCategoryEL.labels
 */
function displaySegmentFields(domNode, segmentNames, segmentIndex) {
  if (!domNode) domNode = document;  // normally invoked for a form element
  for (let i = 0; i < segmentNames.length; i++) {
    const fields = domNode.getElementsByClassName(segmentNames[i]);
    for (const el of fields) {
      el.style.display = (i === segmentIndex - 1) ? "block" : "none";
    }
  }
}



export { generateTestData, clearData, undisplayAllSegmentFields, displaySegmentFields };
