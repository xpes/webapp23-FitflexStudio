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
/*import {
  collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, orderBy, query as fsQuery,
  setDoc, updateDoc
}
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";*/
//import { doc as snfsDoc, getDoc as snGetDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import {
  collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, onSnapshot,
  orderBy, query as fsQuery, setDoc, updateDoc
}
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { Enumeration } from "../../lib/Enumeration.mjs";
import {
  NoConstraintViolation, MandatoryValueConstraintViolation, IntervalConstraintViolation,
  RangeConstraintViolation, UniquenessConstraintViolation, StringLengthConstraintViolation
} from "../../lib/errorTypes.mjs";

import { createModalFromChange } from "../../lib/util.mjs";
import Klass from "../../js/m/Klass.mjs";

/**
 * Define Enumerations
 */
const WeekEL = new Enumeration({ "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday" });

/**
 * Constructor function for the class person
 * @constructor
 * @param {{klassId: integer, klassName1: string, instructor: string, startDate: number, endDate: string, capacity: integer}} slots - Object creation slots.
 */

class Schedule {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ scheduleId, klassIdRefs, scheduleWeek, scheduleTime, duration }) {
    this.scheduleId = scheduleId;
    this.klassIdRefs = klassIdRefs;
    this.scheduleWeek = scheduleWeek;
    this.scheduleTime = scheduleTime;
    this.duration = duration;
  }

  get scheduleId() {
    return this._scheduleId;
  };

  static checkScheduleId(scheduleId) {
    if (!scheduleId) {
      return new MandatoryValueConstraintViolation("A value for the schedule ID must be provided!");
    } else {
      if (isNaN(scheduleId) || scheduleId < 1) {
        return new RangeConstraintViolation("The class ID must be a positive integer!");
      } else {
        return new NoConstraintViolation();
      }
    }
  }

  static async checkScheduleIdAsId(scheduleId) {
    let validationResult = Schedule.checkScheduleId(scheduleId);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!scheduleId) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the schedule ID must be provided!");
      } else {
        const scheduleDocSn = await getDoc(fsDoc(fsDb, "schedules", scheduleId));
        if (scheduleDocSn.exists()) {
          console.log("The schedule ID already exist");
          validationResult = new UniquenessConstraintViolation(
            "There is already a schedule record with this class ID!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
  }

  static checkScheduleIdAsIdRef(id) {
    var validationResult = Schedule.checkScheduleId(id);
    if ((validationResult instanceof NoConstraintViolation) && id) {
      if (!Schedule.instances[id]) {
        validationResult = new ReferentialIntegrityConstraintViolation(
          'There is no schedule record with this schedule ID!');
      }
    }
    return validationResult;
  }

  set scheduleId(scheduleId) {
    var validationResult = Schedule.checkScheduleId(scheduleId);
    if (validationResult instanceof NoConstraintViolation) {
      this._scheduleId = scheduleId;
    } else {
      throw validationResult;
    }
  }
    //all basic constraints, getters, chechers, setters of the personName attribute

    get klassIdRefs() {
      return this._klassIdRefs;
    };
  
    addKlass(k){
      this._klassIdRefs.push(k);
    }

    removeKlass(k) {
      this._klassIdRefs = this._klassIdRefs.filter( d => d.id !== k.id);
    }

    set klassIdRefs(k) {
      this._klassIdRefs = k;
    };

    //all basic constraints, getters, chechers, setters of the startDate attribute
  get scheduleWeek() {
    return this._scheduleWeek;
  }
  static checkScheduleWeek(scheduleWeek) {
    if (!scheduleWeek || scheduleWeek === "") {
      return new MandatoryValueConstraintViolation("A scheduleWeek must be selected!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set scheduleWeek(scheduleWeek) {
    const validationResult = Schedule.checkScheduleWeek(scheduleWeek);
    if (validationResult instanceof NoConstraintViolation) {
      this._scheduleWeek = scheduleWeek;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the startDate attribute
  get scheduleTime() {
    return this._scheduleTime;
  }
  static checkScheduleTime(scheduleTime) {
    if (!scheduleTime || scheduleTime === "") {
      return new MandatoryValueConstraintViolation("A scheduleTime must be selected!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set scheduleTime(scheduleTime) {
    const validationResult = Schedule.checkScheduleTime(scheduleTime);
    if (validationResult instanceof NoConstraintViolation) {
      this._scheduleTime = scheduleTime;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the registeredMember attribute
  get duration() {
    return this._duration;
  };

  static checkDuration(duration) {
    if (!duration || duration === "") {
      return new MandatoryValueConstraintViolation("A duration value must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }

  set duration(duration) {
    //console.log("duration");
    const validationResult = Schedule.checkDuration (duration);
    if (validationResult instanceof NoConstraintViolation) {
      this._duration = duration;
    } else {
      throw validationResult;
    }
  }
}

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/


Schedule.converter = {
  toFirestore: function (schedule) {
    const data = {
      scheduleId: schedule.scheduleId,
      klassIdRefs: schedule.klassIdRefs,
      scheduleWeek: schedule.scheduleWeek,
      scheduleTime: schedule.scheduleTime,
      duration: schedule.duration,
    };
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const schedule = snapshot.data(options);
    console.log(schedule.scheduleId);
    const data = {
      scheduleId: schedule.scheduleId,
      klassIdRefs: schedule.klassIdRefs,
      scheduleWeek: schedule.scheduleWeek,
      scheduleTime: schedule.scheduleTime,
      duration: schedule.duration,
    };
    console.log(data);
    return new Schedule(data);
  },
};

/**
 * Create a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Schedule.add = async function (slots) {
  let schedule = null;
  console.log(`schedule added`);
  try {
    console.log(slots);
    // validate data by creating person instance
    schedule = new Schedule(slots);
    console.log(`schedule creating new schedule ` + slots);
    // invoke asynchronous ID/uniqueness check
    let validationResult = await Schedule.checkScheduleIdAsId(Schedule.scheduleId);

    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    for (const k of schedule.klassIdRefs) {
      const validationResult = await Klass.checkKlassIdAsIdRef( String(k.id));
      if (!validationResult instanceof NoConstraintViolation) {
        throw validationResult;
      }
    }

    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    validationResult = await Klass.checkScheduleWeek(Klass.scheduleWeek);

    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    validationResult = await Klass.checkScheduleTime(Klass.scheduleTime);

    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    validationResult = await Klass.checkDuration(Klass.duration);

    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
    schedule = null;
  }
  if (schedule) {
    try {
      console.log("schedule Added");
      const scheduleDocRef = fsDoc(fsDb, "schedules", Schedule.scheduleId).withConverter(Schedule.converter);
      setDoc(scheduleDocRef, schedule);
      klassCollRef = fsColl( fsDb, "klasses")
        .withConverter( Klass.converter),

      console.log(`schedule record "${Schedule.scheduleId}" created!`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message} + ${e}`);
    }
  }
};

/**
 * Load a person record from Firestore
 * @param personId: {object}
 * @returns {Promise<*>} personRecord: {array}
 */
Schedule.retrieve = async function (scheduleId) {
  try {
    const scheduleRec = (await getDoc(fsDoc(fsDb, "schedules", scheduleId)
      .withConverter(Schedule.converter))).data();
    console.log(`schedule record "${scheduleRec.scheduleId}" retrieved.`);
    return scheduleRec;
  } catch (e) {
    console.error(`Error retrieving schedule record: ${e}`);
  }
};

/**
 * Load all person records from Firestore
 * @returns {Promise<*>} personRecords: {array}
 */
Schedule.retrieveAll = async function (order) {
  if (!order) order = "scheduleId";
  const schedulesCollRef = fsColl(fsDb, "schedules"),
    q = fsQuery(schedulesCollRef, orderBy(order));
  try {
    const scheduleRecs = (await getDocs(q.withConverter(Schedule.converter))).docs.map(d => d.data());
    console.log(`${scheduleRecs.length} schedule records retrieved ${order ? "ordered by " + order : ""}`);
    return scheduleRecs;
  } catch (e) {
    console.error(`Error retrieving schedule records: ${e}`);
  }
};

Schedule.retrieveBlock = async function (params) {
  try {
    let schedulesCollRef = fsColl(fsDb, "schedules");
    // set limit and order in query
    schedulesCollRef = fsQuery(schedulesCollRef, limit(5));
    if (params.order) schedulesCollRef = fsQuery(schedulesCollRef, orderBy(params.order));
    // set pagination "startAt" cursor
    if (params.cursor) {
      schedulesCollRef = fsQuery(schedulesCollRef, startAt(params.cursor));
    }
    const schedulesRecs = (await getDocs(schedulesCollRef
      .withConverter(Schedule.converter))).docs.map(d => d.data());
    if (schedulesRecs.length) {
      console.log(`Block of schedule records retrieved! (cursor: ${schedulesRecs[0][params.order]})`);
    }
    return schedulesRecs;
  } catch (e) {
    console.error(`Error retrieving all schedules records: ${e}`);
  }
};

/**
 * Update a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Schedule.update = async function ({ scheduleId, klassIdRefs, klassIdRefsToAdd, klassIdRefsToRemove, scheduleWeek, scheduleTime, duration }) {
  let noConstraintViolated = true,
    validationResult = null,
    scheduleBeforeUpdate = null;
  const scheduleDocRef = fsDoc(fsDb, "schedules", scheduleId).withConverter(Schedule.converter),
    updatedSlots = {};
  try {
    // retrieve up-to-date book record
    const scheduleDocSn = await getDoc(scheduleDocRef);
    scheduleBeforeUpdate = scheduleDocSn.data();
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  try {
    if (klassIdRefsToAdd) for (const klassIdRef of klassIdRefsToAdd) {
      klassBeforeUpdate.addKlass(klassIdRef);
    }
    if (klassIdRefsToRemove) for (const klassIdRef of klassIdRefsToRemove){
      klassBeforeUpdate.removeKlass(klassIdRef);
    }
    if (klassIdRefsToAdd || klassIdRefsToRemove){
      updatedSlots.klassIdRefs = klassBeforeUpdate.klassIdRefs;
    }
    if (scheduleBeforeUpdate.scheduleTime !== slots.scheduleTime) {
      validationResult = Schedule.checkScheduleTime(slots.scheduleTime);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.scheduleTime = slots.scheduleTime;
      else throw validationResult;
    }
    if (scheduleBeforeUpdate.duration !== slots.duration) {
      validationResult = Schedule.checkDuration(slots.duration);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.duration = slots.duration;
      else throw validationResult;
    }

  } catch (e) {
    noConstraintViolated = false;
    console.error(`${e.constructor.name}: ${e.message}`);
  }

  if (noConstraintViolated) {
    const updatedProperties = Object.keys(updatedSlots);
    if (updatedProperties.length) {
      try{
        if (klassIdRefsToAdd) {
          await Promise.all(klassIdRefsToAdd.map( async k => {
            validationResult = await Klass.checkKlassIdAsIdRef( k.id);
            if (!validationResult instanceof NoConstraintViolation) throw validationResult;
          }));
        }
     
      await updateDoc(scheduleDocRef, updatedSlots);
      console.log(`Property(ies) "${updatedProperties.toString()}" modified for schedule record "${slots.scheduleId}"`);
    
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message}`);
    }
    } else {
      console.log(`No property value changed for schedule record "${slots.scheduleId}"!`);
    }
  }

};

/**
 * Delete a Firestore document from the Firestore collection "persons"
 * @param personId: {string}
 * @returns {Promise<void>}
 */
Schedule.destroy = async function (scheduleId) {
  try {
    await deleteDoc(fsDoc(fsDb, "Schedules", scheduleId));
    console.log(`schedule record "${scheduleId}" deleted!`);
  } catch (e) {
    console.error(`Error deleting class record: ${e}`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Schedule.generateTestData = async function () {
  try {
    console.log("Generating test data...");
    console.log("working");
    const response = await fetch("../../test-data/schedules.json");
    const scheduleRecs = await response.json();
    await Promise.all(scheduleRecs.map(d => Schedule.add(d)));
    console.log(`${scheduleRecs.length} schedule saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
Schedule.clearData = async function (confirmation = true) {
  if (confirm("Do you really want to delete all schedule records?")) {
    try {
      console.log("Clearing test data...");
      const schedulesCollRef = fsColl(fsDb, "schedules");
      const schedulesQrySn = (await getDocs(schedulesCollRef));
      await Promise.all(schedulesQrySn.docs.map(d => Schedule.destroy(d.id)))
      console.log(`${schedulesQrySn.docs.length} schedules deleted.`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message}`);
    }
  }
};

Schedule.observeChanges = async function (scheduleId) {
  try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const scheduleDocRef = fsDoc(fsDb, "schedules", scheduleId).withConverter(Schedule.converter);
    const scheduleRec = (await getDoc(scheduleDocRef)).data();
    console.log(scheduleRec);
    return onSnapshot(scheduleDocRef, function (snapshot) {
      console.log("In snapshot function");
      // create object with original document data
      const originalData = { itemName: "schedule", description: `${scheduleRec.klassName} (classId: ${scheduleRec.scheduleId})` };
      console.log("orginal before " + originalData);
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify(scheduleRec) !== JSON.stringify(snapshot.data())) {
        originalData.type = "MODIFIED";
        console.log(originalData);
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      }
    });
  } catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }
}

export default Schedule;
export { WeekEL };