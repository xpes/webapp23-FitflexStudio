/**
 * @fileOverview  App-level controller code
 * @author Elias George
 */
import Person from "../m/Person.mjs";
import Klass from "../m/Klass.mjs";

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
    Person.generateTestData();
    Klass.generateTestData();
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
      Person.clearData(false);
      Klass.clearData(false);
      console.log("All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
}

export { generateTestData, clearData };
