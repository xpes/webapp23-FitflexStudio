/**
 * @fileOverview  The model class Schedule with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author NourElhouda Benaida
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
const WeekEL = new Enumeration({ "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday" });

/**
 * Constructor function for the class Schedule
 * @constructor
 * @param {{scheduleId: integer, scheduleName: string, startDate:string, endDate: string, instructor: string, scheduleWeek: string, scheduleTime: string, duration: integer}} slots - Object creation slots.
 */
class Schedule {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ scheduleId, klassName, startDate, endDate, instructor, scheduleWeek, scheduleTime, duration }) {
    this.scheduleId = scheduleId;
    this.klassName = klassName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.instructor = instructor;
    this.scheduleWeek = scheduleWeek;
    this.scheduleTime = scheduleTime;
    this.duration = duration;
  }
}
/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 * Create a Firestore document in the Firestore collection "schedules"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Schedule.add = async function (slots) {
  console.log(slots.ScheduleId);
  const schedulesCollRef = fsColl(fsDb, "schedules"),
    ScheduleDocRef = fsDoc(schedulesCollRef, slots.ScheduleId);
  //slots.birthDate = parseInt(slots.birthDate);  // convert from string to integer
  try {
    await setDoc(ScheduleDocRef, slots);
    console.log(`Schedule record ${slots.ScheduleId} created.`);
  } catch (e) {
    console.error(`Error when adding Schedule record: ${e}`);
  }
};

/**
 * Load a Schedule record from Firestore
 * @param ScheduleId: {object}
 * @returns {Promise<*>} ScheduleRecord: {array}
 */
Schedule.retrieve = async function (ScheduleId) {
  let ScheduleDocSn = null;
  try {
    const ScheduleDocRef = fsDoc(fsDb, "schedules", ScheduleId);
    ScheduleDocSn = await getDoc(ScheduleDocRef);
  } catch (e) {
    console.error(`Error when retrieving Schedule record: ${e}`);
    return null;
  }
  const ScheduleRec = ScheduleDocSn.data();
  console.log(ScheduleRec);
  return ScheduleRec;
};
/**
 * Load all Schedule records from Firestore
 * @returns {Promise<*>} ScheduleRecords: {array}
 */
Schedule.retrieveAll = async function () {
  let schedulesQrySn = null;
  try {
    const schedulesCollRef = fsColl(fsDb, "schedules");
    schedulesQrySn = await getDocs(schedulesCollRef);
  } catch (e) {
    console.error(`Error when retrieving Schedule records: ${e}`);
    return null;
  }
  const ScheduleDocs = schedulesQrySn.docs,
    ScheduleRecs = ScheduleDocs.map(d => d.data());
  console.log(`${ScheduleRecs.length} Schedule records retrieved.`);
  return ScheduleRecs;
};
/**
 * Update a Firestore document in the Firestore collection "schedules"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Schedule.update = async function (slots) {
  const updSlots = {};
  // retrieve up-to-date Schedule record
  const ScheduleRec = await Schedule.retrieve(slots.ScheduleId);
  // convert from string to integer
  //if (slots.birthDate) slots.birthDate = parseInt(slots.birthDate);
  // update only those slots that have changed
  if (ScheduleRec.klassName !== slots.klassName) updSlots.klassName = slots.klassName;
  if (ScheduleRec.startDate !== slots.startDate) updSlots.startDate = slots.startDate;
  if (ScheduleRec.endDate !== slots.endDate) updSlots.endDate = slots.endDate;
  if (ScheduleRec.instructor !== slots.instructor) updSlots.instructor = slots.instructor;
  if (ScheduleRec.scheduleWeek !== slots.scheduleWeek) updSlots.scheduleWeek = slots.scheduleWeek;
  if (ScheduleRec.scheduleTime !== slots.scheduleTime) updSlots.scheduleTime = slots.scheduleTime;
  if (ScheduleRec.duration !== slots.duration) updSlots.duration = slots.duration;
  if (Object.keys(updSlots).length > 0) {
    try {
      const ScheduleDocRef = fsDoc(fsDb, "schedules", slots.ScheduleId);
      await updateDoc(ScheduleDocRef, updSlots);
      console.log(`Schedule record ${slots.ScheduleId} modified.`);
    } catch (e) {
      console.error(`Error when updating Schedule record: ${e}`);
    }
  }
};
/**
 * Delete a Firestore document from the Firestore collection "schedules"
 * @param ScheduleId: {string}
 * @returns {Promise<void>}
 */
Schedule.destroy = async function (ScheduleId) {
  try {
    await deleteDoc(fsDoc(fsDb, "schedules", ScheduleId));
    console.log(`Schedule record ${ScheduleId} deleted.`);
  } catch (e) {
    console.error(`Error when deleting Schedule record: ${e}`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 * 
 */
Schedule.generateTestData = async function () {
  let ScheduleRecs = [
    {
      scheduleId: "1",
      klassName: "zumba",
      startDate: "1995-01-15",
      endDate: "1995-06-15",
      instructor: "Michael putz",
      scheduleWeek: "3",
      scheduleTime: "18h-20h",
      duration: "90",
    },
    {
      scheduleId: "2",
      klassName: "yoga",
      startDate: "1995-06-15",
      endDate: "1995-01-15",
      instructor: "Dietmart Nicklass",
      scheduleWeek: "5",
      scheduleTime: "08h-09h",
      duration: "60",
    },
    {
      scheduleId: "3",
      klassName: "boxing",
      startDate: "1995-01-15",
      endDate: "1995-06-15",
      instructor: "Michael kühn",
      scheduleWeek: "1",
      scheduleTime: "18h-20h",
      duration: "90",
    }
  ];
  // save all Schedule record/documents
  await Promise.all(ScheduleRecs.map(d => Schedule.add(d)));
  console.log(`${Object.keys(ScheduleRecs).length} Schedule records saved.`);
};
/**
 * Clear database
 */
Schedule.clearData = async function () {
  if (confirm("Do you really want to delete all Schedule records?")) {
    // retrieve all Schedule documents from Firestore
    const ScheduleRecs = await Schedule.retrieveAll();
    // delete all documents
    await Promise.all(ScheduleRecs.map(d => Schedule.destroy(d.ScheduleId)));
    // ... and then report that they have been deleted
    console.log(`${Object.values(ScheduleRecs).length} Schedule records deleted.`);
  }
};

export default Schedule;
export { WeekEL };
