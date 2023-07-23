/**
 * @fileOverview  The model class Klass with attribute definitions and storage management methods
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
  orderBy, query as fsQuery, setDoc, updateDoc, limit, startAt, writeBatch, arrayUnion
}
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { Enumeration } from "../../lib/Enumeration.mjs";
import {
  NoConstraintViolation, MandatoryValueConstraintViolation, IntervalConstraintViolation,
  RangeConstraintViolation, UniquenessConstraintViolation, StringLengthConstraintViolation
} from "../../lib/errorTypes.mjs";

import { createModalFromChange } from "../../lib/util.mjs";
import Person from "./Person.mjs";

/**
 * Define Enumerations
 */

const WeekEL = new Enumeration({ "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday" });

/**
 * Constructor function for the class Klass
 * @constructor
 * @param {{klassId: integer, klassName: string, instructor: string, startDate: number, endDate: string, capacity: integer}} slots - Object creation slots.
 */

class Klass {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ klassId, klassName, startDate, endDate, capacity, scheduleWeek, scheduleTime, duration }) {
    this.klassId = klassId;
    this.klassName = klassName;
    //this.instructor = [];
    this.startDate = startDate;
    this.endDate = endDate;
    this.capacity = capacity;
    //this.registeredMember = [];
    this.scheduleWeek = scheduleWeek;
    this.scheduleTime = scheduleTime;
    this.duration = duration;
  }

  get klassId() {
    return this._klassId;
  };

  static checkKlassId(klassId) {
    if (!klassId) {
      return new MandatoryValueConstraintViolation("A value for the class ID must be provided!");
    } else {
      if (isNaN(klassId) || klassId < 1) {
        return new RangeConstraintViolation("The class ID must be a positive integer!");
      } else {
        return new NoConstraintViolation();
      }
    }
  }

  static async checkKlassIdAsId(klassId) {
    let validationResult = Klass.checkKlassId(klassId);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!klassId) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the class ID must be provided!");
      } else {
        const klassDocSn = await getDoc(fsDoc(fsDb, "klasses", klassId));
        if (klassDocSn.exists()) {
          console.log("The class ID already exist");
          validationResult = new UniquenessConstraintViolation(
            "There is already a class record with this class ID!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
  }

  static async checkKlassIdAsIdRef(id) {
    let validationResult = Klass.checkKlassId(id);
    if ((validationResult instanceof NoConstraintViolation) && id) {
      const klassDocSn = await getDoc(fsDoc(fsDb, "klasses", id));
      console.log("exist" + klassDocSn.exists());
      if (!klassDocSn.exists()) {
        validationResult = new ReferentialIntegrityConstraintViolation(
          "There is no class record with this ID!");
      }
    }
    return validationResult;
  }

  set klassId(klassId) {
    var validationResult = Klass.checkKlassId(klassId);
    if (validationResult instanceof NoConstraintViolation) {
      this._klassId = klassId;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the KlassName attribute

  get klassName() {
    return this._klassName;
  };

  static checkKlassName(klassName) {
    const KLASSNAME_LENGTH_MAX = 50;
    if (!klassName) {
      return new MandatoryValueConstraintViolation("A class name must be provided!");
    } else if (klassName === "") {
      return new RangeConstraintViolation("The name must be a non-empty string!");
    } else if (klassName.length > KLASSNAME_LENGTH_MAX) {
      return new StringLengthConstraintViolation(
        `The value of the class must be at most ${KLASSNAME_LENGTH_MAX} characters!`);
    }
    else {
      return new NoConstraintViolation();
    }
  }

  set klassName(klassName) {
    const validationResult = Klass.checkKlassName(klassName);
    if (validationResult instanceof NoConstraintViolation) {
      this._klassName = klassName;
    } else {
      throw validationResult;
    }
  }


  //all basic constraints, getters, chechers, setters of the startDate attribute
  get startDate() {
    return this._startDate;
  };

  static checkStartDate(startDate) {
    if (!startDate) {
      return new MandatoryValueConstraintViolation("A date must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }

  set startDate(startDate) {
    const validationResult = Klass.checkStartDate(startDate);
    if (validationResult instanceof NoConstraintViolation) {
      this._startDate = startDate;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the endDate attribute
  get endDate() {
    return this._endDate;
  };

  static checkEndDate(endDate) {
    if (!endDate) {
      return new MandatoryValueConstraintViolation("A date must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }

  set endDate(endDate) {
    const validationResult = Klass.checkEndDate(endDate);
    if (validationResult instanceof NoConstraintViolation) {
      this._endDate = endDate;
    } else {
      throw validationResult;
    }
  }


  get capacity() {
    return this._capacity;
  };

  static checkCapacity(capacity) {
    const CAPACITY_MAX = 20;
    if (!capacity) {
      return new MandatoryValueConstraintViolation("A capacity must be provided!");
    } else if (capacity === "") {
      return new RangeConstraintViolation("The capacity must be a non-empty string!");
    } else if (capacity > CAPACITY_MAX) {
      return new StringLengthConstraintViolation(
        `The value of the capacity must be at most ${CAPACITY_MAX} characters!`);
    }
    else {
      return new NoConstraintViolation();
    }
  }

  set capacity(capacity) {
    const validationResult = Klass.checkCapacity(capacity);
    if (validationResult instanceof NoConstraintViolation) {
      this._capacity = capacity;
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
    const validationResult = Klass.checkScheduleWeek(scheduleWeek);
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
    const validationResult = Klass.checkScheduleTime(scheduleTime);
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
    
    const validationResult = Klass.checkDuration(duration);
    if (validationResult instanceof NoConstraintViolation) {
      this._duration = duration;
    } else {
      throw validationResult;
    }
  }
  //all basic constraints, getters, chechers, setters of the registeredMember attribute

  get registeredMember() {
    return this._registeredMember;
  };



}

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/


Klass.converter = {
  toFirestore: function (klass) {
    
    const data = {
      klassId: klass.klassId,
      klassName: klass.klassName,
      //instructor: klass.instructor,
      startDate: klass.startDate,
      endDate: klass.endDate,
      capacity: klass.capacity,
      scheduleWeek: klass.scheduleWeek,
      scheduleTime: klass.scheduleTime,
      duration: klass.duration,
      //registeredMember: klass.registeredMember
    };
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const klass = snapshot.data(options);
    var data = {
      klassId: klass.klassId,
      klassName: klass.klassName,
      //instructor: klass.instructor,
      startDate: klass.startDate,
      endDate: klass.endDate,
      capacity: klass.capacity,
      scheduleWeek: klass.scheduleWeek,
      scheduleTime: klass.scheduleTime,
      duration: klass.duration,
      //registeredMember: klass.registeredMember
    };
    return new Klass(data);
  }
};

/**
 * Create a Firestore document in the Firestore collection "Klasses"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Klass.add = async function (slots) {
  let klass = null;
  try {
    // validate data by creating klass instance
    klass = new Klass(slots);
    // invoke asynchronous ID/uniqueness check
    let validationResult = await Klass.checkKlassIdAsId(klass.klassId);
    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
    klass = null;
  }
  if (klass) {
    try {
      const klassDocRef = await fsDoc(fsDb, "klasses", klass.klassId).withConverter(Klass.converter);
      await setDoc(klassDocRef, klass);
      console.log(`klass record "${klass.klassId}" created!`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message} + ${e}`);
    }
  }
};

/**
 * Load a klass record from Firestore
 * @param klassId: {object}
 * @returns {Promise<*>} klassRecord: {array}
 */
Klass.retrieve = async function (klassId) {
  try {
    const klassRec = (await getDoc(fsDoc(fsDb, "klasses", klassId)
      .withConverter(Klass.converter))).data();
    console.log(`Klass record "${klassRec.klassId}" retrieved.`);
    return klassRec;
  } catch (e) {
    console.error(`Error retrieving class record: ${e}`);
  }
};

/**
 * Load all klass records from Firestore
 * @returns {Promise<*>} klassRecords: {array}
 */
Klass.retrieveAll = async function (order) {
  if (!order) order = "klassId";
  const klassesCollRef = fsColl(fsDb, "klasses"),
    q = fsQuery(klassesCollRef, orderBy(order));
  try {
    const klassRecs = (await getDocs(q.withConverter(Klass.converter))).docs.map(d => d.data());
    console.log(`${klassRecs.length} klass records retrieved ${order ? "ordered by " + order : ""}`);
    return klassRecs;
  } catch (e) {
    console.error(`Error retrieving class records: ${e}`);
  }
};

Klass.retrieveBlock = async function (params) {
  try {
    let klassesCollRef = fsColl(fsDb, "klasses");
    // set limit and order in query
    klassesCollRef = fsQuery(klassesCollRef, limit(5));
    if (params.order) klassesCollRef = fsQuery(klassesCollRef, orderBy(params.order));
    // set pagination "startAt" cursor
    if (params.cursor) {
      klassesCollRef = fsQuery(klassesCollRef, startAt(params.cursor));
    }
    const klassesRecs = (await getDocs(klassesCollRef
      .withConverter(Klass.converter))).docs.map(d => d.data());
    if (klassesRecs.length) {
      console.log(`Block of klasses records retrieved! (cursor: ${klassesRecs[0][params.order]})`);
    }
    return klassesRecs;
  } catch (e) {
    console.error(`Error retrieving all klasses records: ${e}`);
  }
};

/**
 * Update a Firestore document in the Firestore collection "klasses"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Klass.update = async function (slots) {
  let noConstraintViolated = true,
    validationResult = null,
    klassBeforeUpdate = null;
  const klassDocRef = fsDoc(fsDb, "klasses", slots.klassId).withConverter(Klass.converter),
    updatedSlots = {};
  try {
    // retrieve up-to-date book record
    const klassDocSn = await getDoc(klassDocRef);
    klassBeforeUpdate = klassDocSn.data();
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  try {
    if (klassBeforeUpdate.klassName !== slots.klassName) {
      validationResult = Klass.checkKlassName(slots.klassName);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.klassName = slots.klassName;
      else throw validationResult;
    }
    // if (klassBeforeUpdate.instructor !== slots.instructor) {
    //   validationResult = Klass.checkInstructor(slots.instructor);
    //   if (validationResult instanceof NoConstraintViolation) updatedSlots.instructor = slots.instructor;
    //   else throw validationResult;
    // }
    if (klassBeforeUpdate.startDate !== slots.startDate) {
      validationResult = Klass.checkStartDate(slots.startDate);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.startDate = slots.startDate;
      else throw validationResult;
    }
    if (klassBeforeUpdate.capacity !== slots.capacity) {
      validationResult = Klass.checkCapacity(slots.capacity);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.capacity = slots.capacity;
      else throw validationResult;
    }
    if (klassBeforeUpdate.scheduleWeek !== slots.scheduleWeek) {
      validationResult = Klass.checkScheduleWeek(slots.scheduleWeek);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.scheduleWeek = slots.scheduleWeek;
      else throw validationResult;
    }
    if (klassBeforeUpdate.scheduleTime !== slots.scheduleTime) {
      validationResult = Klass.checkCapacity(slots.scheduleTime);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.scheduleTime = slots.scheduleTime;
      else throw validationResult;
    }
    if (klassBeforeUpdate.duration !== slots.duration) {
      validationResult = Klass.checkDuration(slots.duration);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.duration = slots.duration;
      else throw validationResult;
    }
    // if (klassBeforeUpdate.registeredMember !== slots.registeredMember) {
    //   validationResult = Klass.checkRegisteredMember(slots.registeredMember);
    //   if (validationResult instanceof NoConstraintViolation) updatedSlots.registeredMember = slots.registeredMember;
    //   else throw validationResult;
    // }

  } catch (e) {
    noConstraintViolated = false;
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  if (noConstraintViolated) {
    const updatedProperties = Object.keys(updatedSlots);
    if (updatedProperties.length) {
      await updateDoc(klassDocRef, updatedSlots);
      console.log(`Property(ies) "${updatedProperties.toString()}" modified for klass record "${slots.klassId}"`);
    } else {
      console.log(`No property value changed for class record "${slots.klassId}"!`);
    }
  }
};

/**
 * Delete a Firestore document from the Firestore collection "klasses"
 * @param klassId: {string}
 * @returns {Promise<void>}
 */
Klass.destroy = async function (klassId) {
  try {
    await deleteDoc(fsDoc(fsDb, "klasses", klassId));
    console.log(`klass record "${klassId}" deleted!`);
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
Klass.generateTestData = async function () {
  try {
    const response = await fetch("../../test-data/klasses.json");
    const klassRecs = await response.json();
    await Promise.all(klassRecs.map(d => Klass.add(d)));
    console.log(`${klassRecs.length} klasses saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
Klass.clearData = async function (confirmation = true) {
  if (confirm("Do you really want to delete all klass records?")) {
    try {
      const klassesCollRef = fsColl(fsDb, "klasses");
      const klassesQrySn = (await getDocs(klassesCollRef));
      await Promise.all(klassesQrySn.docs.map(d => Klass.destroy(d.id)))
      console.log(`${klassesQrySn.docs.length} classes deleted.`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message}`);
    }
  }
};

Klass.observeChanges = async function (klassId) {
  try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const klassDocRef = fsDoc(fsDb, "klasses", klassId).withConverter(Klass.converter);
    const klassRec = (await getDoc(klassDocRef)).data();
    return onSnapshot(klassDocRef, function (snapshot) {
      // create object with original document data
      const originalData = { itemName: "klass", description: `${klassRec.klassName} (classId: ${klassRec.klassId})` };
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify(klassRec) !== JSON.stringify(snapshot.data())) {
        originalData.type = "MODIFIED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      }
    });
  } catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }
}

export default Klass;
export { WeekEL };