/**
 * @fileOverview  The model class person with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @copyright Copyright 2020-2022 Gerd Wagner (Chair of Internet Technology) and Juan-Francisco Reyes,
 * Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";

/**
 * Define Enumerations
 */
//const GenderEL = new Enumeration(["Male", "Female", "Other"]);
//const CategoryEL = new Enumeration(["Yoga training", "Fitness training", "Personal training"]);
//const WeekEL = new Enumeration(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
//const ServiceEL = new Enumeration(["Massage Chair", "Zumba Aerobics", "Personal Training", "Women's Only Studio", "Steam and Sauna rooms"]);
//const PlanEL = new Enumeration(["3 Months", "6 Months", "Yearly"]);

/**
 * Constructor function for the class person
 * @constructor
 * @param {{personId: integer, personName: string, gender:string, birthDate: number, email: string, phoneNo: integer, address: string, IBAN: integer}} slots - Object creation slots.
 */
class Person {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ personId, personName, gender, birthDate, email, phoneNo, address, IBAN }) {
    this.personId = personId;
    this.personName = personName;
    this.gender = gender;
    this.birthDate = birthDate;
    this.email = email;
    this.phoneNo = phoneNo;
    this.address = address;
    this.IBAN = IBAN;
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
Person.add = async function (slots) {
  console.log(slots.personId);
  const personsCollRef = fsColl(fsDb, "persons"),
    personDocRef = fsDoc(personsCollRef, slots.personId);
  //slots.birthDate = parseInt(slots.birthDate);  // convert from string to integer
  try {
    await setDoc(personDocRef, slots);
    console.log(`person record ${slots.personId} created.`);
  } catch (e) {
    console.error(`Error when adding person record: ${e}`);
  }
};

/**
 * Load a person record from Firestore
 * @param personId: {object}
 * @returns {Promise<*>} personRecord: {array}
 */
Person.retrieve = async function (personId) {
  let personDocSn = null;
  try {
    const personDocRef = fsDoc(fsDb, "persons", personId);
    personDocSn = await getDoc(personDocRef);
  } catch (e) {
    console.error(`Error when retrieving person record: ${e}`);
    return null;
  }
  const personRec = personDocSn.data();
  return personRec;
};
/**
 * Load all person records from Firestore
 * @returns {Promise<*>} personRecords: {array}
 */
Person.retrieveAll = async function () {
  let personsQrySn = null;
  try {
    const personsCollRef = fsColl(fsDb, "persons");
    personsQrySn = await getDocs(personsCollRef);
  } catch (e) {
    console.error(`Error when retrieving person records: ${e}`);
    return null;
  }
  const personDocs = personsQrySn.docs,
    personRecs = personDocs.map(d => d.data());
  console.log(`${personRecs.length} person records retrieved.`);
  return personRecs;
};
/**
 * Update a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Person.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date person record
  const personRec = await person.retrieve(slots.personId);
  // convert from string to integer
  if (slots.birthDate) slots.birthDate = parseInt(slots.birthDate);
  // update only those slots that have changed
  if (personRec.personName !== slots.personName) updSlots.personName = slots.personName;
  if (personRec.birthDate !== slots.birthDate) updSlots.birthDate = slots.birthDate;
  if (Object.keys(updSlots).length > 0) {
    try {
      const personDocRef = fsDoc(fsDb, "persons", slots.personId);
      await updateDoc(personDocRef, updSlots);
      console.log(`person record ${slots.personId} modified.`);
    } catch (e) {
      console.error(`Error when updating person record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "persons"
 * @param personId: {string}
 * @returns {Promise<void>}
 */
Person.destroy = async function (personId) {
  try {
    await deleteDoc(fsDoc(fsDb, "persons", personId));
    console.log(`person record ${personId} deleted.`);
  } catch (e) {
    console.error(`Error when deleting person record: ${e}`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Person.generateTestData = async function () {
  let personRecs = [
    {
      personId: "1",
      personName: "NourElhouda Benaida",
      gender: "Female",
      birthDate: "15-06-1995",
      email: "houda.bn15@gmail.com",
      phoneNo: "03412345637",
      address: "Hello World!",
      IBAN: "DE09876543567897654",
    },
    {
      personId: "2",
      personName: "Marat Safin",
      gender: "Male",
      birthDate: "05-01-1980",
      email: "Maratee2@gmail.com",
      phoneNo: "03879765434",
      address: "Moskaw str",
      IBAN: "RE0989876545678954",
    },
    {
      personId: "3",
      personName: "Selma Hayek",
      gender: "Female",
      birthDate: "15-03-1965",
      email: "selmoucha@gmail.com",
      phoneNo: "098765432345",
      address: "hay elhattab str",
      IBAN: "DE0987654988345245",
    }
  ];
  // save all person record/documents
  await Promise.all(personRecs.map(d => person.add(d)));
  console.log(`${Object.keys(personRecs).length} person records saved.`);
};
/**
 * Clear database
 */
Person.clearData = async function () {
  if (confirm("Do you really want to delete all person records?")) {
    // retrieve all person documents from Firestore
    const personRecs = await person.retrieveAll();
    // delete all documents
    await Promise.all(personRecs.map(d => person.destroy(d.personId)));
    // ... and then report that they have been deleted
    console.log(`${Object.values(personRecs).length} person records deleted.`);
  }
};

export default Person;
