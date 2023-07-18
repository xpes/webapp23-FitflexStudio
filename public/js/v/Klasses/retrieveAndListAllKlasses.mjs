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

 /***************************************************************
  Load data
  ***************************************************************/
 const KlassRecords = await Klass.retrieveAll();
 
 /***************************************************************
  Declare variables for accessing UI elements
  ***************************************************************/
 const tableBodyEl = document.querySelector("table#Klasses>tbody");
 
 /***************************************************************
  Render list of all Person records
  ***************************************************************/
 // for each Person, create a table row with a cell for each attribute
 for (const KlassRec of KlassRecords) {
   const row = tableBodyEl.insertRow();
   row.insertCell().textContent = KlassRec.klassId;
   row.insertCell().textContent = KlassRec.klassName;
   row.insertCell().textContent = KlassRec.instructor;
   row.insertCell().textContent = KlassRec.startDate;
   row.insertCell().textContent = KlassRec.capacity;
   row.insertCell().textContent = KlassRec.registeredMember;
 }