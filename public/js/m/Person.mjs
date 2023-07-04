/**
 * @fileOverview  The model class person with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
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
const GenderEL = new Enumeration({ "M": "Male", "F": "Female", "O": "Other" });

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
    //___________________________________________________________________________________ all basic constraints, getters, chechers, setters of the personId attribute
    get personId() {
      return this.personId;
    };

    static checkPersonId( personId) {
      if (!personId) return new NoConstraintViolation();
      else if (!isIntegerOrIntegerString(personId)) {
          return new RangeConstraintViolation("The value of person ID must be an integer!"); //must be integer
      } else if (!isIntegerOrIntegerString(personId) || parseInt(personId) < 1) {
          return new RangeConstraintViolation(
              "The value of person ID must be a positive integer!"); //must be positive
      } else {
          return new NoConstraintViolation();
      }
    }
    
    static checkPersonIdAsId( personId) {
      var validationResult = Person.checkPersonId( personId);
      if ((validationResult instanceof NoConstraintViolation)) {
          if (!personId) {
              validationResult = new MandatoryValueConstraintViolation(
                  "A value for the person ID must be provided!");
          } else if (Person.instances[personId]) {
              validationResult = new UniquenessConstraintViolation(
                  `There is already a person record with person ID ${personId}`);
          } else {
              validationResult = new NoConstraintViolation();
          }
      }
      return validationResult;
    }
    set personId( personId) {
      var validationResult = Person.checkPersonIdAsId( personId);
      if (validationResult instanceof NoConstraintViolation) {
          this._personId = personId;
      } else {
          throw validationResult;
      }
    }
//___________________________________________________________________________________ all basic constraints, getters, chechers, setters of the personName attribute

get personName() {
  return this._personName;
}
static checkPersonName(personName) {
  const PERSONNAME_LENGTH_MAX = 50;
  if (!personName) {
      return new MandatoryValueConstraintViolation("A name must be provided!");
  } else if (!isNonEmptyString(personName)) {
      return new RangeConstraintViolation("The name must be a non-empty string!");
  } else if (personName.length > PERSONNAME_LENGTH_MAX) {
      return new StringLengthConstraintViolation(
          `The value of the person must be at most ${PERSONNAME_LENGTH_MAX} characters!`);
  }
  else {
      return new NoConstraintViolation();
  }
}
set personName( personName) {
  const validationResult = Person.checkPersonName( personName);
  if (validationResult instanceof NoConstraintViolation) {
      this._personName = personName;
  } else {
      throw validationResult;
  }
}
//_______________________________________________________________________________________all basic constraints, getters, setters, checkers of the birthDate

get birthDate() {
  return this._birthDate;
}
static checkBirthDate(bd) {
  const BIRTH_DATE_MIN = new Date("2007-01-01");
  if (!bd || bd === "") return new MandatoryValueConstraintViolation(
      "A value for the birth date must be provided!"
  );
  else {
      if (new Date(bd) < BIRTH_DATE_MIN) {
          return new IntervalConstraintViolation(
              `The value of birth date must be greater than or equal to 
        ${createIsoDateString(BIRTH_DATE_MIN)}!`);
      } else {
          return new NoConstraintViolation();
      }
  }
}
set birthDate( bd) {
  const validationResult = Person.checkBirthDate( bd);
  if (validationResult instanceof NoConstraintViolation) {
      this._birthDate = new Date( bd);
  } else {
      throw validationResult;
  }
}

//_______________________________________________________________________________________all basic constraints, getters, setters, checkers of the phone number
get phoneNumber() {
  return this._phoneNumber;
}
static checkPhoneNumber(phoneNumber) {
  const PHONENUMBER_LENGTH_MAX = 12;     //MAX nbr of numbers = 12
  if (!phoneNumber) {
      return new MandatoryValueConstraintViolation("A phone number must be provided!");
  } else if (!isNonEmptyString(phoneNumber)) {
      return new RangeConstraintViolation("The phone number must be a non-empty string!");
  } else if (phoneNumber.length > PHONENUMBER_LENGTH_MAX) {
      return new StringLengthConstraintViolation(
          `The value of the phone number must be at most ${PHONENUMBER_LENGTH_MAX} characters!`);
  }
  else {
      return new NoConstraintViolation();
  }
}
set phoneNumber( phoneNumber) {
  const validationResult = Person.checkPhoneNumber( phoneNumber);
  if (validationResult instanceof NoConstraintViolation) {
      this._personName = personName;
  } else {
      throw validationResult;
  }
}

//_______________________________________________________________________________________all basic constraints, getters, setters, checkers of the email
get phoneEmail() {
  return this._phoneEmail;
}
static checkEmail(email) {
  if (!email) {
      return new MandatoryValueConstraintViolation("An email must be provided!");
  } else if (!isNonEmptyString(email)) {
      return new RangeConstraintViolation("The email must be a non-empty string!");
  } else {
      return new NoConstraintViolation();
  }
}
set email( email) {
  const validationResult = Person.checkEmail( email);
  if (validationResult instanceof NoConstraintViolation) {
      this._email = email;
  } else {
      throw validationResult;
  }
}
    //___________________________________________________________________________________ all basic constraints, getters, chechers, setters of the address attribute
    get address() {
      return this.address;
    };

    
    static checkAddress(address) {

      if (!address) {
          return new MandatoryValueConstraintViolation("An address must be provided!");
      } else if (!isNonEmptyString(address)) {
          return new RangeConstraintViolation("The phone number must be a non-empty string!");
      } else {
          return new NoConstraintViolation();
      }
    }
    set address( address) {
      var validationResult = Person.checkAddress( address);
      if (validationResult instanceof NoConstraintViolation) {
          this._address = address;
      } else {
          throw validationResult;
      }
    }


    //___________________________________________________________________________________ all basic constraints, getters, chechers, setters of the IBAN attribute
    get iban() {
      return this.iban;
    };

    
    static checkIBAN(iban) {

      if (!iban) {
          return new MandatoryValueConstraintViolation("An IBAN must be provided!");
      } else if (!isNonEmptyString(iban)) {
          return new RangeConstraintViolation("The IBAN must be a non-empty string!");
      } else {
          return new NoConstraintViolation();
      }
    }
    set iban( iban) {
      var validationResult = Person.checkIBAN( iban);
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
 * Conversion between a Book object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {birthDate: number,
* personId: (Document.personId|*), personName}), fromFirestore: (function(*, *=): Person)}}
*/
Person.converter = {
 toFirestore: function (person) {
   const data = {
     personId: parseInt( person.personId),   //person.personId
     personName: person.personName,
     gender: person.gender,
     birthDate: person.birthDate,//year: parseInt( book.year)
     email: person.email,
     phoneNo: person.phoneNo, //phoneNo: parseInt( person.phoneNO)
     address: person.address,
     IBAN: person.IBAN,
   };
 },
 fromFirestore: function (snapshot, options) {
   const data = snapshot.data( options);
   return new Person( data);
 },
};



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
  console.log(personRec);
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
  const personRec = await Person.retrieve(slots.personId);
  // convert from string to integer
  //if (slots.birthDate) slots.birthDate = parseInt(slots.birthDate);
  // update only those slots that have changed
  if (personRec.personName !== slots.personName) updSlots.personName = slots.personName;
  if (personRec.gender !== slots.gender) updSlots.gender = slots.gender;
  if (personRec.birthDate !== slots.birthDate) updSlots.birthDate = slots.birthDate;
  if (personRec.email !== slots.email) updSlots.email = slots.email;
  if (personRec.phoneNumber !== slots.phoneNumber) updSlots.phoneNumber = slots.phoneNumber;
  if (personRec.address !== slots.address) updSlots.address = slots.address;
  if (personRec.iban !== slots.iban) updSlots.iban = slots.iban;
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
      gender: "2",
      birthDate: "1995-06-15",
      email: "houda.bn15@gmail.com",
      phoneNumber: "03412345637",
      address: "Hello World!",
      iban: "DE09876543567897654",
    },
    {
      personId: "2",
      personName: "Marat Safin",
      gender: "1",
      birthDate: "1980-01-05",
      email: "Maratee2@gmail.com",
      phoneNumber: "03879765434",
      address: "Moskaw str",
      iban: "RE0989876545678954",
    },
    {
      personId: "3",
      personName: "Selma Hayek",
      gender: "2",
      birthDate: "1965-03-15",
      email: "selmoucha@gmail.com",
      phoneNumber: "098765432345",
      address: "hay elhattab str",
      iban: "DE0987654988345245",
    }
  ];
  // save all person record/documents
  await Promise.all(personRecs.map(d => Person.add(d)));
  console.log(`${Object.keys(personRecs).length} person records saved.`);
};
/**
 * Clear database
 */
Person.clearData = async function (confirmation = true) {
  if (confirmation) {
    if (confirm("Do you really want to delete all person records?")) {
      // retrieve all person documents from Firestore
      const personRecs = await Person.retrieveAll();
      // delete all documents
      await Promise.all(personRecs.map(d => Person.destroy(d.personId)));
      // ... and then report that they have been deleted
      console.log(`${Object.values(personRecs).length} person records deleted.`);
    }
  } else {
    // retrieve all person documents from Firestore
    const personRecs = await Person.retrieveAll();
    // delete all documents
    await Promise.all(personRecs.map(d => Person.destroy(d.personId)));
    // ... and then report that they have been deleted
    console.log(`${Object.values(personRecs).length} person records deleted.`);
  }
};

export default Person;
export { GenderEL };
