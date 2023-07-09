/**
 * @fileOverview  The model class person with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
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
/**
 * Define Enumerations
 */
const GenderEL = new Enumeration({ "M": "Male", "F": "Female", "O": "Other" });

/**
 * Constructor function for the class person
 * @constructor
 * @param {{personId: integer, personName: string, gender:string, birthDate: number, email: string, phoneNumber: integer, address: string, IBAN: integer}} slots - Object creation slots.
 */
class Person {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ personId, personName, gender, birthDate, email, phoneNumber, address, iban }) {
    this.personId = personId;
    this.personName = personName;
    this.gender = gender;
    this.birthDate = birthDate;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.iban = iban;
  }
  get personId() {
    return this._personId;
  };

  static checkPersonId(personId) {
    if (!personId) {
      return new MandatoryValueConstraintViolation("A value for the person ID must be provided!");
    } else {
      if (isNaN(personId) || personId < 1) {
        return new RangeConstraintViolation("The person ID must be a positive integer!");
      } else {
        return new NoConstraintViolation();
      }
    }
  }

  static async checkPersonIdAsId(personId) {
    let validationResult = Person.checkPersonId(personId);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!personId) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the person ID must be provided!");
      } else {
        const personDocSn = await getDoc(fsDoc(fsDb, "persons", personId));
        if (personDocSn.exists()) {
          console.log("The person ID already exist");
          validationResult = new UniquenessConstraintViolation(
            "There is already a person record with this person ID!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
  }

  set personId(personId) {
    var validationResult = Person.checkPersonId(personId);
    if (validationResult instanceof NoConstraintViolation) {
      this._personId = personId;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the personName attribute

  get personName() {
    return this._personName;
  }
  static checkPersonName(personName) {
    const PERSONNAME_LENGTH_MAX = 50;
    if (!personName) {
      return new MandatoryValueConstraintViolation("A name must be provided!");
    } else if (personName === "") {
      return new RangeConstraintViolation("The name must be a non-empty string!");
    } else if (personName.length > PERSONNAME_LENGTH_MAX) {
      return new StringLengthConstraintViolation(
        `The value of the person must be at most ${PERSONNAME_LENGTH_MAX} characters!`);
    }
    else {
      return new NoConstraintViolation();
    }
  }
  set personName(personName) {
    const validationResult = Person.checkPersonName(personName);
    if (validationResult instanceof NoConstraintViolation) {
      this._personName = personName;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the gender attribute

  get gender() {
    return this._gender;
  }
  static checkGender(gender) {
    if (!gender || gender === "") {
      return new MandatoryValueConstraintViolation("A gender must be selected!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set gender(gender) {
    const validationResult = Person.checkGender(gender);
    if (validationResult instanceof NoConstraintViolation) {
      this._gender = gender;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the birthDate attribute

  get birthDate() {
    return this._birthDate;
  }
  static checkBirthDate(birthDate) {
    let DOB = new Date(birthDate);
    const currentDate = new Date(Date.now());
    DOB.setFullYear(DOB.getFullYear() + 16);
    if (!birthDate || birthDate === "") {
      return new MandatoryValueConstraintViolation("A Date must be selected!");
    } else if (!(DOB.getTime() < currentDate.getTime())) {
      return new IntervalConstraintViolation("age should be greater than 16");
    } else {
      return new NoConstraintViolation();
    }
  }
  set birthDate(birthDate) {
    const validationResult = Person.checkBirthDate(birthDate);
    if (validationResult instanceof NoConstraintViolation) {
      this._birthDate = birthDate;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the email attribute

  get email() {
    return this._email;
  }
  static checkEmail(email) {
    if (!email || email === "") {
      return new MandatoryValueConstraintViolation("An email must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set email(email) {
    const validationResult = Person.checkEmail(email);
    if (validationResult instanceof NoConstraintViolation) {
      this._email = email;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the phoneNumber attribute

  get phoneNumber() {
    return this._phoneNumber;
  }
  static checkPhoneNumber(phoneNumber) {
    if (!phoneNumber || phoneNumber === "") {
      return new MandatoryValueConstraintViolation("A Phone# must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set phoneNumber(phoneNumber) {
    const validationResult = Person.checkPhoneNumber(phoneNumber);
    if (validationResult instanceof NoConstraintViolation) {
      this._phoneNumber = phoneNumber;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the address attribute

  get address() {
    return this._address;
  }
  static checkAddress(address) {
    if (!address || address === "") {
      return new MandatoryValueConstraintViolation("An address must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set address(address) {
    const validationResult = Person.checkAddress(address);
    if (validationResult instanceof NoConstraintViolation) {
      this._address = address;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get Iban() {
    return this._iban;
  }
  static checkIban(iban) {
    if (!iban || iban === "") {
      return new MandatoryValueConstraintViolation("An IBAN must be provided!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set Iban(iban) {
    const validationResult = Person.checkIban(iban);
    if (validationResult instanceof NoConstraintViolation) {
      this._iban = iban;
    } else {
      throw validationResult;
    }
  }
}



/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/

/**
 * Conversion between a Person object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {birthDate: number,
* personId: (Document.personId|*), personName}), fromFirestore: (function(*, *=): Person)}}
*/
Person.converter = {
  toFirestore: function (person) {
    const data = {
      personId: person.personId,
      personName: person.personName,
      gender: person.gender,
      birthDate: person.birthDate,
      email: person.email,
      phoneNumber: person.phoneNumber,
      address: person.address,
      iban: person.iban,
    };
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Person(data);
  }
};

/**
 * Create a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Person.add = async function (slots) {
  let person = null;
  try {
    // validate data by creating person instance
    person = new Person(slots);
    // invoke asynchronous ID/uniqueness check
    let validationResult = await Person.checkPersonIdAsId(person.personId);
    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
    person = null;
  }
  if (person) {
    try {
      const personDocRef = fsDoc(fsDb, "persons", person.personId).withConverter(Person.converter);
      await setDoc(personDocRef, person);
      console.log(`person record "${person.personId}" created!`);
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
Person.retrieve = async function (personId) {
  try {
    const personRec = (await getDoc(fsDoc(fsDb, "persons", personId)
      .withConverter(Person.converter))).data();
    console.log(`Person record "${personRec.personId}" retrieved.`);
    return personRec;
  } catch (e) {
    console.error(`Error retrieving person record: ${e}`);
  }
};
/**
 * Load all person records from Firestore
 * @returns {Promise<*>} personRecords: {array}
 */
Person.retrieveAll = async function (order) {
  if (!order) order = "personId";
  const personsCollRef = fsColl(fsDb, "persons"),
    q = fsQuery(personsCollRef, orderBy(order));
  try {
    const personRecs = (await getDocs(q.withConverter(Person.converter))).docs.map(d => d.data());
    console.log(`${personRecs.length} person records retrieved ${order ? "ordered by " + order : ""}`);
    return personRecs;
  } catch (e) {
    console.error(`Error retrieving person records: ${e}`);
  }
};
/**
 * Update a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Person.update = async function (slots) {
  let noConstraintViolated = true,
    validationResult = null,
    personBeforeUpdate = null;
  const personDocRef = fsDoc(fsDb, "persons", slots.personId).withConverter(Person.converter),
    updatedSlots = {};
  try {
    // retrieve up-to-date book record
    const personDocSn = await getDoc(personDocRef);
    personBeforeUpdate = personDocSn.data();
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  try {
    if (personBeforeUpdate.personName !== slots.personName) {
      validationResult = Person.checkPersonName(slots.personName);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.personName = slots.personName;
      else throw validationResult;
    }
    if (personBeforeUpdate.gender !== slots.gender) {
      validationResult = Person.checkGender(slots.gender);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.gender = slots.gender;
      else throw validationResult;
    }
    if (personBeforeUpdate.birthDate !== slots.birthDate) {
      validationResult = Person.checkBirthDate(slots.birthDate);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.birthDate = slots.birthDate;
      else throw validationResult;
    }
    if (personBeforeUpdate.email !== slots.email) {
      validationResult = Person.checkEmail(slots.email);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.email = slots.email;
      else throw validationResult;
    }
    if (personBeforeUpdate.phoneNumber !== slots.phoneNumber) {
      validationResult = Person.checkPhoneNumber(slots.phoneNumber);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.phoneNumber = slots.phoneNumber;
      else throw validationResult;
    }
    if (personBeforeUpdate.address !== slots.address) {
      validationResult = Person.checkAddress(slots.address);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.address = slots.address;
      else throw validationResult;
    }
    if (personBeforeUpdate.iban !== slots.iban) {
      validationResult = Person.checkIban(slots.iban);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.iban = slots.iban;
      else throw validationResult;
    }

  } catch (e) {
    noConstraintViolated = false;
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  if (noConstraintViolated) {
    const updatedProperties = Object.keys(updatedSlots);
    if (updatedProperties.length) {
      await updateDoc(personDocRef, updatedSlots);
      console.log(`Property(ies) "${updatedProperties.toString()}" modified for person record "${slots.personId}"`);
    } else {
      console.log(`No property value changed for person record "${slots.personId}"!`);
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
    console.log(`person record "${personId}" deleted!`);
  } catch (e) {
    console.error(`Error deleting book record: ${e}`);
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create test data
 */
Person.generateTestData = async function () {
  try {
    console.log("Generating test data...");
    const response = await fetch("../../test-data/persons.json");
    const personRecs = await response.json();
    await Promise.all(personRecs.map(d => Person.add(d)));
    console.log(`${personRecs.length} persons saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
Person.clearData = async function (confirmation = true) {
  if (confirm("Do you really want to delete all person records?")) {
    try {
      console.log("Clearing test data...");
      const personsCollRef = fsColl(fsDb, "persons");
      const personsQrySn = (await getDocs(personsCollRef));
      await Promise.all(personsQrySn.docs.map(d => Person.destroy(d.id)))
      console.log(`${personsQrySn.docs.length} persons deleted.`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message}`);
    }
  }
};

Person.observeChanges = async function (personId) {
  try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const personDocRef = fsDoc(fsDb, "persons", personId).withConverter(Person.converter);
    const personRec = (await getDoc(personDocRef)).data();
    console.log(personRec);
    return onSnapshot(personDocRef, function (snapshot) {
      console.log("In snapshot function");
      // create object with original document data
      const originalData = { itemName: "person", description: `${personRec.personName} (personId: ${personRec.personId})` };
      console.log("orginal before " + originalData);
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify(personRec) !== JSON.stringify(snapshot.data())) {
        originalData.type = "MODIFIED";
        console.log(originalData);
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      }
    });
  } catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }
}

export default Person;
export { GenderEL };
