/**
 * @fileOverview  The model class person with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Nourelhouda Benaida
 * @copyright Copyright 2020-2022 Gerd Wagner (Chair of Internet Technology) and Juan-Francisco Reyes,
 * Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { Enumeration } from "../../lib/Enumeration.mjs";

/**
 * Define Enumerations
 */
const GenderEL = new Enumeration({ "M": "Male", "F": "Female", "O": "Other" });

/**
 * Constructor function for the class person
 * @constructor
 * @param {{klassId: integer, klassName: string, instructor:string, startDate: number, endDate: string, capacity: integer, address: string, IBAN: integer}} slots - Object creation slots.
 */
class Klass {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ klassId, klassName, instructor, startDate, endDate, capacity, registeredMembers }) {
    this.klassId = klassId;
    this.klassName = klassName;
    this.instructor = instructor;
    this.startDate = startDate;
    this.endDate = endDate;
    this.capacity = capacity;
    this.registeredMembers = registeredMembers;
  }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Klass.add = async function (slots) {
  console.log(slots.klassId);
  const klassesCollRef = fsColl(fsDb, "klasses"),
    klassDocRef = fsDoc(personsCollRef, slots.klassId);
  //slots.birthDate = parseInt(slots.birthDate);  // convert from string to integer
  try {
    await setDoc(klassDocRef, slots);
    console.log(`klass record ${slots.klassId} created.`);
  } catch (e) {
    console.error(`Error when adding klass record: ${e}`);
  }
};

/**
 * Load a person record from Firestore
 * @param klassId: {object}
 * @returns {Promise<*>} personRecord: {array}
 */
Klass.retrieve = async function (klassId) {
  let klassDocSn = null;
  try {
    const klassDocRef = fsDoc(fsDb, "klasses", klassId);
    klassDocSn = await getDoc(klassDocRef);
  } catch (e) {
    console.error(`Error when retrieving klass record: ${e}`);
    return null;
  }
  const klassRec = klassDocSn.data();
  console.log(klassRec);
  return klassRec;
};
/**
 * Load all person records from Firestore
 * @returns {Promise<*>} personRecords: {array}
 */
Klass.retrieveAll = async function () {
  let klassesQrySn = null;
  try {
    const klassesCollRef = fsColl(fsDb, "klasses");
    klassesQrySn = await getDocs(klassesCollRef);
  } catch (e) {
    console.error(`Error when retrieving class records: ${e}`);
    return null;
  }
  const klassDocs = klassesQrySn.docs,
    klassRecs = klassDocs.map(d => d.data());
  console.log(`${klassRecs.length} klass records retrieved.`);
  return klassRecs;
};
/**
 * Update a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Klass.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date person record
  const klassRec = await Klass.retrieve(slots.klassId);
  // convert from string to integer
  //if (slots.birthDate) slots.birthDate = parseInt(slots.birthDate);
  // update only those slots that have changed
  if (klassRec.klassName !== slots.klassName) updSlots.klassName = slots.klassName;
  if (klassRec.instructor !== slots.instructor) updSlots.instructor = slots.instructor;
  if (klassRec.startDate !== slots.startDate) updSlots.startDate = slots.startDate;
  if (klassRec.endDate !== slots.endDate) updSlots.endDate = slots.endDate;
  if (klassRec.capacity !== slots.capacity) updSlots.capacity = slots.capacity;
  if (klassRec.registeredMembers !== slots.registeredMembers) updSlots.registeredMembers = slots.registeredMembers;
  if (Object.keys(updSlots).length > 0) {
    try {
      const klassDocRef = fsDoc(fsDb, "klasses", slots.klassId);
      await updateDoc(klassDocRef, updSlots);
      console.log(`klass record ${slots.klassId} modified.`);
    } catch (e) {
      console.error(`Error when updating klass record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "persons"
 * @param klassId: {string}
 * @returns {Promise<void>}
 */
Klass.destroy = async function (klassId) {
  try {
    await deleteDoc(fsDoc(fsDb, "klasses", klassId));
    console.log(`klass record ${klassId} deleted.`);
  } catch (e) {
    console.error(`Error when deleting class record: ${e}`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Klass.generateTestData = async function () {
  let klassRecs = [
    {
      klassId: "1",
      klassName: "yoga",
      instructor: "",
      startDate: "2023-06-15",
      endDate: "2023-01-15",
      capacity: "20",
      registeredMembers: "",
    },
    {
      klassId: "2",
      klassName: "zumba",
      instructor: "",
      startDate: "1995-01-15",
      endDate: "1995-01-15",
      capacity: "30",
      registeredMembers: "",
    },
    {
        klassId: "3",
        klassName: "boxing",
        instructor: "Michael kühn",
        startDate: "1995-06-15",
        endDate: "1995-01-15",
        capacity: "10",
        registeredMembers: "",
      },
  ];
  // save all person record/documents
  await Promise.all(klassRecs.map(d => Klass.add(d)));
  console.log(`${Object.keys(klassRecs).length} class records saved.`);
};
/**
 * Clear database
 */
Klass.clearData = async function () {
  if (confirm("Do you really want to delete all class records?")) {
    // retrieve all person documents from Firestore
    const klassRecs = await Klass.retrieveAll();
    // delete all documents
    await Promise.all(klassRecs.map(d => Klass.destroy(d.klassId)));
    // ... and then report that they have been deleted
    console.log(`${Object.values(klassRecs).length} class records deleted.`);
  }
};

export default Klass;
export {  };
