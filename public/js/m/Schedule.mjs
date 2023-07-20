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
  constructor({ scheduleId, klassId, klassName, instructor, scheduleWeek, scheduleTime, duration }) {
    this.scheduleId = scheduleId;
    if (klassId) this.klassId = klassId;
    if (klassName || klassId) {
       this.klassName = klassName;
    }
    if (instructor || klassId) {
      this.instructor = instructor;
    }
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
  //all basic constraints, getters, chechers, setters of the klassId attribute

  get klassId() {
    return this._klassId;
  }
  static checkKlassId(klassId) {
      
    if (!klassId) {
      return new MandatoryValueConstraintViolation("A class name must be provided!");
    } else if (klassId === "") {
      return new RangeConstraintViolation("The name must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }
  
  set klassId(klassId) {
    console.log("In klass Id");
    var validationResult = Schedule.checkklassId(klassId, this.role);
    if (validationResult instanceof NoConstraintViolation) {
      this._klassId = klassId;
    } else {
      throw validationResult;
    }
  }
    //all basic constraints, getters, chechers, setters of the personName attribute

    get klassName() {
      return this._klassName;
    };
  
    static checkKlassName(klassName) {
      
      if (!klassName) {
        return new MandatoryValueConstraintViolation("A class name must be provided!");
      } else if (klassName === "") {
        return new RangeConstraintViolation("The name must be a non-empty string!");
      } else {
        return new NoConstraintViolation();
      }
    }
  
    set klassName(klassName) {
      console.log("klassName");
      const validationResult = Schedule.checkKlassName(klassName);
      if (validationResult instanceof NoConstraintViolation) {
        this._klassName = klassName;
      } else {
        throw validationResult;
      }
    }

  //all basic constraints, getters, chechers, setters of the instructor attribute

   get Instructor() {
     return this._instructor;
   };
   
   static checkInstructor(instructor) {
     if (!instructor || instructor === "") {
       return new MandatoryValueConstraintViolation("An instructor value must be provided!");
     } else {
       return new NoConstraintViolation();
     }
   }
   
   set Instructor(instructor) {
     const validationResult = Schedule.checkInstructor(instructor);
     if (validationResult instanceof NoConstraintViolation) {
       this._instructor = instructor;
     } else {
       throw validationResult;
     }
   }

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
    console.log("duration");
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
      klassName: schedule.klassName,
      instructor: schedule.instructor,
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
      klassName: schedule.klassName,
      instructor: schedule.instructor,
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
    validationResult = await Klass.checkKlassId(Klass.klassId);
    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    validationResult = await Klass.checkKlassName(Klass.klassName);
    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    validationResult = await Klass.checkInstructor(Klass.instructor);
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

/**
 * Update a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Schedule.update = async function (slots) {
  let noConstraintViolated = true,
    validationResult = null,
    scheduleBeforeUpdate = null;
  const scheduleDocRef = fsDoc(fsDb, "schedules", slots.scheduleId).withConverter(Schedule.converter),
    updatedSlots = {};
  try {
    // retrieve up-to-date book record
    const scheduleDocSn = await getDoc(scheduleDocRef);
    scheduleBeforeUpdate = scheduleDocSn.data();
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  try {
    if (scheduleBeforeUpdate.klassName !== slots.klassName) {
      validationResult = Schedule.checkKlassName(slots.klassName);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.klassName = slots.klassName;
      else throw validationResult;
    }
    if (scheduleBeforeUpdate.instructor !== slots.instructor) {
      validationResult = Schedule.checkInstructor(slots.instructor);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.instructor = slots.instructor;
      else throw validationResult;
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
      await updateDoc(scheduleDocRef, updatedSlots);
      console.log(`Property(ies) "${updatedProperties.toString()}" modified for schedule record "${slots.scheduleId}"`);
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

