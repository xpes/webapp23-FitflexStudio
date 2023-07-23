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
  orderBy, query as fsQuery, setDoc, updateDoc, limit, startAt, writeBatch, arrayUnion, arrayRemove
}
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { Enumeration } from "../../lib/Enumeration.mjs";
import {
  NoConstraintViolation, MandatoryValueConstraintViolation, IntervalConstraintViolation,
  RangeConstraintViolation, UniquenessConstraintViolation, StringLengthConstraintViolation, ConstraintViolation
} from "../../lib/errorTypes.mjs";

import { createModalFromChange } from "../../lib/util.mjs";
import Membership from "./Membership.mjs";
import Klass from "./Klass.mjs";
/**
 * Define Enumerations
 */
const GenderEL = new Enumeration({ "M": "Male", "F": "Female", "O": "Other" });
const PersonRoleEL = new Enumeration(["Trainer", "Member"]);
const TrainerCategoryEL = new Enumeration(["Yoga Trainer", "Fitness Trainer", "Personal Trainer"]);

/**
 * Constructor function for the class person
 * @constructor
 * @param {{personId: integer, personName: string, gender:string, birthDate: number, email: string, phoneNumber: integer, address: string, IBAN: integer}} slots - Object creation slots.
 */
class Person {
  // record parameter with the ES6 syntax for function parameter destructuring
  constructor({ personId, personName, gender, birthDate, email, phoneNumber, address, iban, trainingClasses, role, trainerId, trainerCategory, memberId, membershipType }) {
    this.personId = personId;
    this.personName = personName;
    this.gender = gender;
    this.birthDate = birthDate;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.iban = iban;
    this.trainingClasses = trainingClasses;
    if (role) this.role = role;
    if (trainerId) this.trainerId = trainerId;
    if (trainerCategory) this.trainerCategory = trainerCategory;
    if (memberId) this.memberId = memberId;
    if (membershipType) this.membershipType = membershipType;
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
        const personDocSn = await getDoc(fsDoc(fsDb, "persons", personId.toString()));
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
      this._personId = parseInt(personId);
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

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get trainingClasses() {
    return this._trainingClasses;
  }

  static checkTrainingClasses(klass_ids) {
    var constraintViolation = null;
    if (!klass_ids) {
      // author(s) are optional
      constraintViolation = new NoConstraintViolation();
    } else {
      for (let k of klass_ids) {
        constraintViolation =
          Klass.checkKlassIdAsIdRef(k.id);
      }
    }
    return constraintViolation;
  }

  addTrainingClasses(a) {
    // a can be an ID reference or an object reference
    const klass_id = (typeof a !== "object") ? a : a.klassId;
    const validationResult = Klass.checkKlassId(klass_id);
    if (klass_id && validationResult instanceof NoConstraintViolation) {
      // add the new klass reference
      let data, klass;
      klass = Klass.retrieve(klass_id);
      data = {
        klassId: klass.klassId,
        klassName: klass.klassName,
        instructor: klass.instructor,
        registeredMember: klass.registeredMember,
        startDate: klass.startDate,
        endDate: klass.endDate,
        capacity: klass.capacity
      }
      // automatically add the derived inverse reference
      if (this.role === 1) {
        //data.instructor.push({ id: this.personId, name: this.personName });
        this._trainingClasses.push(data);
      } else {
        //this._trainingClasses[klass_id]._registeredMember[this._personId] = this.personName;
        //data.registeredMember.push({ id: this.personId, name: this.personName });
        this._trainingClasses.push(data);
      }
      //this._trainingClasses.push(data);
      Klass.update(data);
    } else {
      throw validationResult;
    }
  }
  removeTrainingClasses(a) {
    // a can be an ID reference or an object reference
    const klass_id = (typeof a !== "object") ? a : a.klassId;
    const validationResult = Klass.checkKlassId(klass_id);
    if (klass_id && validationResult instanceof NoConstraintViolation) {
      // automatically delete the derived inverse reference
      if (this.role === 1) {
        delete this._trainingClasses[klass_id].instructor[this._personId];
      } else {
        delete this._trainingClasses[klass_id].registeredMember[this._personId];
      }
      Klass.update(this._trainingClasses[klass_id]);
      // delete the klass reference
      delete this._trainingClasses[klass_id];
    } else {
      throw validationResult;
    }
  }

  set trainingClasses(a) {
    if (Array.isArray(a)) {  // array of IdRefs
      this._trainingClasses = a;
    }
  }

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get role() {
    return this._role;
  }
  static checkRole(role) {
    if (role === undefined || role === "") {
      return new NoConstraintViolation();  // category is optional
    } else if (parseInt(role) < 1 || parseInt(role) > PersonRoleEL.MAX) {
      return new RangeConstraintViolation(
        "Invalid value for category: " + role);
    } else {
      return new NoConstraintViolation();
    }
  }
  set role(role) {
    var validationResult = Person.checkRole(role);
    if (validationResult instanceof NoConstraintViolation) {
      this._role = role;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get trainerId() {
    return this._trainerId;
  }
  static checkTrainerId(trainerId, role) {
    if (parseInt(role) === PersonRoleEL.TRAINER && !trainerId) {
      return new MandatoryValueConstraintViolation(
        "A training ID must be provided for a Trainer!");
    } else if (parseInt(role) === PersonRoleEL.TRAINER && trainerId && (typeof (trainerId) !== "string" || trainerId.trim() === "")) {
      return new RangeConstraintViolation(
        "The taining ID must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set trainerId(trainerId) {
    var validationResult = Person.checkTrainerId(trainerId, this.role);
    if (validationResult instanceof NoConstraintViolation) {
      this._trainerId = trainerId;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get trainerCategory() {
    return this._trainerCategory;
  }
  static checkTrainerCategory(trainerCategory, role) {
    if (parseInt(role) === PersonRoleEL.TRAINER && !trainerCategory) {
      return new MandatoryValueConstraintViolation(
        "A training category must be provided for a Trainer!");
    } else if (parseInt(role) === PersonRoleEL.TRAINER && parseInt(trainerCategory) < 1 || parseInt(trainerCategory) > TrainerCategoryEL.MAX) {
      return new RangeConstraintViolation(
        "Invalid value for  trainer category: " + trainerCategory);
    } else {
      return new NoConstraintViolation();
    }
  }
  set trainerCategory(trainerCategory) {
    var validationResult = Person.checkTrainerCategory(trainerCategory, this.role);
    if (validationResult instanceof NoConstraintViolation) {
      this._trainerCategory = trainerCategory;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get memberId() {
    return this._memberId;
  }
  static checkMemberId(memberId, role) {
    if (parseInt(role) === PersonRoleEL.MEMBER && !memberId) {
      return new MandatoryValueConstraintViolation(
        "A member ID must be provided for a Member!");
    } else if (parseInt(role) === PersonRoleEL.MEMBER && memberId && (typeof (memberId) !== "string" || memberId.trim() === "")) {
      return new RangeConstraintViolation(
        "The member ID must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set memberId(memberId) {
    var validationResult = Person.checkMemberId(memberId, this.role);
    if (validationResult instanceof NoConstraintViolation) {
      this._memberId = memberId;
    } else {
      throw validationResult;
    }
  }

  //all basic constraints, getters, chechers, setters of the IBAN attribute

  get membershipType() {
    return this._membershipType;
  }
  static checkMembershipType(membershipType, role) {
    if (parseInt(role) === PersonRoleEL.MEMBER && !membershipType) {
      return new MandatoryValueConstraintViolation(
        "A membership type must be provided for a Member!");
    } else if (parseInt(role) === PersonRoleEL.MEMBER && membershipType && (typeof (membershipType) !== "string")) {
      return new RangeConstraintViolation(
        "The membership type must be non-empty!");
    } else {
      return new NoConstraintViolation();
    }
  }
  set membershipType(membershipType) {
    var validationResult = Person.checkMembershipType(membershipType, this.role);
    if (validationResult instanceof NoConstraintViolation) {
      this._membershipType = membershipType;
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
    var data = {
      personId: person.personId,
      personName: person.personName,
      gender: person.gender,
      birthDate: person.birthDate,
      email: person.email,
      phoneNumber: person.phoneNumber,
      address: person.address,
      iban: person.iban,
      trainingClasses: person.trainingClasses
    };
    if (person.role) {
      data["role"] = person.role;
      switch (parseInt(person.role)) {
        case PersonRoleEL.TRAINER:
          data["trainerId"] = person.trainerId;
          data["trainerCategory"] = person.trainerCategory;
          break;
        case PersonRoleEL.MEMBER:
          data["memberId"] = person.memberId;
          data["membershipType"] = person.membershipType;
          break;
      }
    }
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const person = snapshot.data(options);
    var data = {
      personId: person.personId,
      personName: person.personName,
      gender: person.gender,
      birthDate: person.birthDate,
      email: person.email,
      phoneNumber: person.phoneNumber,
      address: person.address,
      iban: person.iban,
      trainingClasses: person.trainingClasses
    };
    if (person.role) {
      data["role"] = person.role;
      switch (parseInt(person.role)) {
        case PersonRoleEL.TRAINER:
          data["trainerId"] = person.trainerId;
          data["trainerCategory"] = person.trainerCategory;
          break;
        case PersonRoleEL.MEMBER:
          data["memberId"] = person.memberId;
          data["membershipType"] = person.membershipType;
          break;
      }
    }
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
    if (person.role === 2) {
      validationResult = await Membership.checkMembershipIdAsIdRef(person.membershipType);
      if (!validationResult instanceof NoConstraintViolation) throw validationResult.message;
    }
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
    person = null;
  }
  if (person) {
    try {
      const personDocRef = fsDoc(fsDb, "persons", person.personId.toString()).withConverter(Person.converter),
        klassCollRef = fsColl(fsDb, "klasses").withConverter(Klass.converter);
      const personInverseRef = { id: person.personId, name: person.personName, role: person.role ? person.role : "" };
      let personInstRef = {};
      let personMemRef = {};
      if (person.role === "1") {
        personInstRef = { id: person.personId, name: person.personName };
      } else {
        personMemRef = { id: person.personId, name: person.personName };
      }
      const batch = writeBatch(fsDb); // initiate batch write object
      await batch.set(personDocRef, person); // create people record (master)
      await Promise.all(person.trainingClasses.map(a => {
        const klassDocRef = fsDoc(klassCollRef, String(a.id));
        //batch.update(klassDocRef, { people: arrayUnion(personInverseRef) });
        batch.update(klassDocRef, { instructor: arrayUnion(personInstRef) });
        batch.update(klassDocRef, { registeredMember: arrayUnion(personMemRef) });
      }));
      batch.commit(); // commit batch write
      console.log(`person record "${person.personId}" created!`);
    }
    catch (e) {
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
 * Load all person records from Firestore
 * @param params: {object}
 * @returns {Promise<*>} bookRecs: {array}
 */
Person.retrieveBlock = async function (params) {
  try {
    let personsCollRef = fsColl(fsDb, "persons");
    // set limit and order in query
    personsCollRef = fsQuery(personsCollRef, limit(5));
    if (params.order) personsCollRef = fsQuery(personsCollRef, orderBy(params.order));
    // set pagination "startAt" cursor
    if (params.cursor) {
      personsCollRef = fsQuery(personsCollRef, startAt(params.cursor));
    }
    const personsRecs = (await getDocs(personsCollRef
      .withConverter(Person.converter))).docs.map(d => d.data());
    if (personsRecs.length) {
      console.log(`Block of persons records retrieved! (cursor: ${personsRecs[0][params.order]})`);
    }
    return personsRecs;
  } catch (e) {
    console.error(`Error retrieving all persons records: ${e}`);
  }
};

/**
 * Update a Firestore document in the Firestore collection "persons"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Person.update = async function (slots) {
  console.log(slots);
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
    if (Array.isArray(slots.trainingClasses) && slots.trainingClasses.length > 0) {
      validationResult = await Person.checkTrainingClasses(slots.trainingClasses);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.trainingClasses = slots.trainingClasses;
      else throw validationResult;
    }
    if (personBeforeUpdate.role !== slots.role) {
      validationResult = Person.checkRole(slots.role);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.role = slots.role;
      else throw validationResult;
    }
    if (slots.role === "1") {
      if (personBeforeUpdate.trainerId !== slots.trainerId) {
        validationResult = Person.checkTrainerId(slots.trainerId, slots.role);
        if (validationResult instanceof NoConstraintViolation) updatedSlots.trainerId = slots.trainerId;
        else throw validationResult;
      }
      if (personBeforeUpdate.trainerCategory !== slots.trainerCategory) {
        validationResult = Person.checkTrainerCategory(slots.trainerCategory, slots.role);
        if (validationResult instanceof NoConstraintViolation) updatedSlots.trainerCategory = slots.trainerCategory;
        else throw validationResult;
      }
    } else if (slots.role === "2") {
      if (personBeforeUpdate.memberId !== slots.memberId) {
        validationResult = Person.checkMemberId(slots.memberId, slots.role);
        if (validationResult instanceof NoConstraintViolation) updatedSlots.memberId = slots.memberId;
        else throw validationResult;
      }
      if (personBeforeUpdate.membershipType !== slots.membershipType) {
        validationResult = Person.checkMembershipType(slots.membershipType, slots.role);
        if (validationResult instanceof NoConstraintViolation) updatedSlots.membershipType = slots.membershipType;
        else throw validationResult;
      }
    }
  } catch (e) {
    noConstraintViolated = false;
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  if (noConstraintViolated) {
    console.log(updatedSlots);
    const updatedProperties = Object.keys(updatedSlots);
    if (updatedProperties.length) {
      await updateDoc(personDocRef, updatedSlots);
      console.log(`Property(ies) "${updatedProperties.toString()}" modified for person record "${slots.personId}"`);
    } else {
      console.log(`No property value changed for person record "${slots.personId}"!`);
    }
  }
}




/**
 * Delete a Firestore document from the Firestore collection "persons"
 * @param personId: {string}
 * @returns {Promise<void>}
 */
// Person.destroy = async function (personId) {
//   try {
//     await deleteDoc(fsDoc(fsDb, "persons", personId));
//     console.log(`person record "${personId}" deleted!`);
//   } catch (e) {
//     console.error(`Error deleting book record: ${e}`);
//   }
// };

Person.destroy = async function (personId) {
  const personDocRef = fsDoc(fsDb, "persons", personId)
    .withConverter(Person.converter),
    klassesCollRef = fsColl(fsDb, "klasses")
      .withConverter(Klass.converter);
  try {
    const personRec = (await getDoc(personDocRef
      .withConverter(Person.converter))).data();
    const inverseRef = { id: personRec.personId, name: personRec.personName };
    const batch = writeBatch(fsDb); // initiate batch write object
    // delete derived inverse reference property, Authors::/authoredBooks
    await Promise.all(personRec.trainingClasses.map(aId => {
      const klassDocRef = fsDoc(klassesCollRef, String(aId.id));
      batch.update(klassDocRef, { instructor: arrayRemove(inverseRef) });
      batch.update(klassDocRef, { registeredMember: arrayRemove(inverseRef) });
    }));
    batch.delete(personDocRef); // create book record (master)
    batch.commit(); // commit batch write
    console.log(`Person record "${personId}" deleted!`);
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
    return onSnapshot(personDocRef, function (snapshot) {
      // create object with original document data
      const originalData = { itemName: "person", description: `${personRec.personName} (personId: ${personRec.personId})` };
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify(personRec) !== JSON.stringify(snapshot.data())) {
        originalData.type = "MODIFIED";
        createModalFromChange(originalData); // invoke modal window reporting change of original data
      }
    });
  } catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }
}

export default Person;
export { GenderEL, PersonRoleEL, TrainerCategoryEL };
