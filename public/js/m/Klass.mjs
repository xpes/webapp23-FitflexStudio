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
import Person from "./Person.mjs";

/**
 * Define Enumerations
 */
//const GenderEL = new Enumeration({ "M": "Male", "F": "Female", "O": "Other" });

/**
 * Constructor function for the class person
 * @constructor
 * @param {{klassId: integer, klassName: string, instructor: string, startDate: number, endDate: string, capacity: integer}} slots - Object creation slots.
 */

class Klass {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ klassId }) {
    this.klassId = klassId;

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

  static checkKlassIdAsIdRef(id) {
    var validationResult = Klass.checkKlassId(id);
    if ((validationResult instanceof NoConstraintViolation) && id) {
      if (!Klass.instances[id]) {
        validationResult = new ReferentialIntegrityConstraintViolation(
          'There is no klass record with this klass ID!');
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


}

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/


Klass.converter = {
  toFirestore: function (klass) {
    const data = {
      klassId: klass.klassId,

    };
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Klass(data);
  },
};

/**
 * Create a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Klass.add = async function (slots) {
  let klass = null;
  console.log(`klass added`);
  try {
    console.log(slots);
    // validate data by creating person instance
    klass = new Klass(slots);
    console.log(`klass creating new class ` + slots);
    // invoke asynchronous ID/uniqueness check
    let validationResult = await Klass.checkKlassIdAsId(klass.klassId);
    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
    klass = null;
    console.log("class read");
  }
  if (klass) {
    try {
      const klassDocRef = fsDoc(fsDb, "klasses", klass.klassId).withConverter(Klass.converter);
      setDoc(klassDocRef, klass);
      console.log(`klass record "${klass.klassId}" created!`);
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
 * Load all person records from Firestore
 * @returns {Promise<*>} personRecords: {array}
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

/**
 * Update a Firestore document in the Firestore collection "persons"
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
 * Delete a Firestore document from the Firestore collection "persons"
 * @param personId: {string}
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
    console.log("Generating test data...");
    console.log("working");
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
      console.log("Clearing test data...");
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
    console.log(klassRec);
    return onSnapshot(klassDocRef, function (snapshot) {
      console.log("In snapshot function");
      // create object with original document data
      const originalData = { itemName: "klass", description: `${klassRec.klassName} (classId: ${klassRec.klassId})` };
      console.log("orginal before " + originalData);
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify(klassRec) !== JSON.stringify(snapshot.data())) {
        originalData.type = "MODIFIED";
        console.log(originalData);
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      }
    });
  } catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }
}

export default Klass;

