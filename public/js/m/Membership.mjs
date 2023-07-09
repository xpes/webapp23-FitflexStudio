/**
 * @fileOverview  The model class membership with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 * @copyright Copyright 2020-2022 Gerd Wagner (Chair of Internet Technology) and Juan-Francisco Reyes,
 * Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
import { fsDb } from "../initFirebase.mjs";
import {
    collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, orderBy, query as fsQuery,
    setDoc, updateDoc, deleteField
}
    from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { Enumeration } from "../../lib/Enumeration.mjs";
import {
    NoConstraintViolation, MandatoryValueConstraintViolation, IntervalConstraintViolation,
    RangeConstraintViolation, UniquenessConstraintViolation, StringLengthConstraintViolation
} from "../../lib/errorTypes.mjs";

import { createModalFromChange } from "../../lib/util.mjs";
/**
 * Define Enumerations
 */
const PlanEL = new Enumeration(["3 Months", "6 Months", "Yearly"]);
const ServiceEL = new Enumeration(["Message Chair", "Zumba Aerobics", "Personal Training", "Woman's Only Studio", "Steam and Sauna Rooms"]);

/**
 * Constructor function for the class membership
 * @constructor
 * @param {{membershipId: integer, membershipName: string, price:number, duration: string, membershipAccess: string}} slots - Object creation slots.
 */
class Membership {
    // record parameter with the ES6 syntax for function parameter destructuring
    constructor({ membershipId, membershipName, price, duration, membershipAccess }) {
        this.membershipId = membershipId;
        this.membershipName = membershipName;
        this.price = price;
        this.duration = duration;
        this.membershipAccess = membershipAccess;
    }
    get membershipId() {
        return this._membershipId;
    };

    static checkMembershipId(membershipId) {
        if (!membershipId) {
            return new MandatoryValueConstraintViolation("A value for the membership ID must be provided!");
        } else {
            if (isNaN(membershipId) || membershipId < 1) {
                return new RangeConstraintViolation("The Membership ID must be a positive integer!");
            } else {
                return new NoConstraintViolation();
            }
        }
    }

    static async checkMembershipIdAsId(membershipId) {
        let validationResult = Membership.checkMembershipId(membershipId);
        if ((validationResult instanceof NoConstraintViolation)) {
            if (!membershipId) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the Membership ID must be provided!");
            } else {
                const membershipDocSn = await getDoc(fsDoc(fsDb, "memberships", membershipId));
                if (membershipDocSn.exists()) {
                    console.log("The Membership ID already exist");
                    validationResult = new UniquenessConstraintViolation(
                        "There is already a Membership record with this Membership ID!");
                } else {
                    validationResult = new NoConstraintViolation();
                }
            }
        }
        return validationResult;
    }

    set membershipId(membershipId) {
        var validationResult = Membership.checkMembershipId(membershipId);
        if (validationResult instanceof NoConstraintViolation) {
            this._membershipId = membershipId;
        } else {
            throw validationResult;
        }
    }

    //all basic constraints, getters, chechers, setters of the membershipName attribute

    get membershipName() {
        return this._membershipName;
    }
    static checkMembershipName(membershipName) {
        const NAME_LENGTH_MAX = 50;
        if (!membershipName) {
            return new MandatoryValueConstraintViolation("A name must be provided!");
        } else if (membershipName === "") {
            return new RangeConstraintViolation("The name must be a non-empty string!");
        } else if (membershipName.length > NAME_LENGTH_MAX) {
            return new StringLengthConstraintViolation(
                `The value of the membership must be at most ${NAME_LENGTH_MAX} characters!`);
        }
        else {
            return new NoConstraintViolation();
        }
    }
    set membershipName(membershipName) {
        const validationResult = Membership.checkMembershipName(membershipName);
        if (validationResult instanceof NoConstraintViolation) {
            this._membershipName = membershipName;
        } else {
            throw validationResult;
        }
    }

    //all basic constraints, getters, chechers, setters of the price attribute

    get price() {
        return this._price;
    }
    static checkPrice(price) {
        if (!price || price === "") {
            return new MandatoryValueConstraintViolation("A price must be entered!");
        } else {
            return new NoConstraintViolation();
        }
    }
    set price(price) {
        const validationResult = Membership.checkPrice(price);
        if (validationResult instanceof NoConstraintViolation) {
            this._price = price;
        } else {
            throw validationResult;
        }
    }

    //all basic constraints, getters, chechers, setters of the duration attribute

    get duration() {
        return this._duration;
    }
    static checkDuration(duration) {
        if (!duration || duration === "") {
            return new MandatoryValueConstraintViolation("A duration must be selected!");
        } else {
            return new NoConstraintViolation();
        }
    }
    set duration(duration) {
        const validationResult = Membership.checkDuration(duration);
        if (validationResult instanceof NoConstraintViolation) {
            this._duration = duration;
        } else {
            throw validationResult;
        }
    }

    //all basic constraints, getters, chechers, setters of the Membership Access attribute

    get membershipAccess() {
        return this._membershipAccess;
    }
    static checkMembershipAccess(membershipAccess) {
        if (!membershipAccess || membershipAccess === "") {
            return new MandatoryValueConstraintViolation("An Membership Access must be selected!");
        } else {
            return new NoConstraintViolation();
        }
    }
    set membershipAccess(membershipAccess) {
        const validationResult = Membership.checkMembershipAccess(membershipAccess);
        if (validationResult instanceof NoConstraintViolation) {
            this._membershipAccess = membershipAccess;
        } else {
            throw validationResult;
        }
    }

}

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/

/**
 * Conversion between a Membership object and a corresponding Firestore document
 * @type {{toFirestore: (function(*): {price: number,
* membershipId: (Document.membershipId|*), membershipName}), fromFirestore: (function(*, *=): Membership)}}
*/
Membership.converter = {
    toFirestore: function (membership) {
        const data = {
            membershipId: membership.membershipId,
            membershipName: membership.membershipName,
            price: membership.price,
            duration: membership.duration,
            membershipAccess: membership.membershipAccess
        };
        return data;
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Membership(data);
    },
};

/**
 * Create a Firestore document in the Firestore collection "memberships"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Membership.add = async function (slots) {
    let membership = null;
    try {
        // validate data by creating membership instance
        membership = new Membership(slots);
        // invoke asynchronous ID/uniqueness check
        let validationResult = await Membership.checkMembershipIdAsId(membership.membershipId);
        if (!validationResult instanceof NoConstraintViolation) throw validationResult;
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
        membership = null;
    }
    if (membership) {
        try {
            const membershipDocRef = fsDoc(fsDb, "memberships", membership.membershipId).withConverter(Membership.converter);
            await setDoc(membershipDocRef, membership);
            console.log(`membership record "${membership.membershipId}" created!`);
        } catch (e) {
            console.error(`${e.constructor.name}: ${e.message} + ${e}`);
        }
    }
};

/**
 * Load a membership record from Firestore
 * @param membershipId: {object}
 * @returns {Promise<*>} membershipRecord: {array}
 */
Membership.retrieve = async function (membershipId) {
    try {
        const membershipRec = (await getDoc(fsDoc(fsDb, "memberships", membershipId)
            .withConverter(Membership.converter))).data();
        console.log(`membership record "${membershipRec.membershipId}" retrieved.`);
        return membershipRec;
    } catch (e) {
        console.error(`Error retrieving membership record: ${e}`);
    }
};
/**
 * Load all membership records from Firestore
 * @returns {Promise<*>} membershipRecords: {array}
 */
Membership.retrieveAll = async function (order) {
    if (!order) order = "membershipId";
    const membershipsCollRef = fsColl(fsDb, "memberships"),
        q = fsQuery(membershipsCollRef, orderBy(order));
    try {
        const membershipRecs = (await getDocs(q.withConverter(Membership.converter))).docs.map(d => d.data());
        console.log(`${membershipRecs.length} membership records retrieved ${order ? "ordered by " + order : ""}`);
        return membershipRecs;
    } catch (e) {
        console.error(`Error retrieving membership records: ${e}`);
    }
};
/**
 * Update a Firestore document in the Firestore collection "memberships"
 * @param slots: {object}
 * @returns {Promise<void>}
 */
Membership.update = async function (slots) {
    let noConstraintViolated = true,
        validationResult = null,
        membershipBeforeUpdate = null;
    const membershipDocRef = fsDoc(fsDb, "memberships", slots.membershipId).withConverter(memberhip.converter),
        updatedSlots = {};
    try {
        // retrieve up-to-date book record
        const membershipDocSn = await getDoc(membershipDocRef);
        membershipBeforeUpdate = membershipDocSn.data();
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    try {
        if (membershipBeforeUpdate.membershipName !== slots.membershipName) {
            validationResult = Membership.checkPersonName(slots.membershipName);
            if (validationResult instanceof NoConstraintViolation) updatedSlots.membershipName = slots.membershipName;
            else throw validationResult;
        }
        if (membershipBeforeUpdate.gender !== slots.gender) {
            validationResult = Membership.checkGender(slots.gender);
            if (validationResult instanceof NoConstraintViolation) updatedSlots.gender = slots.gender;
            else throw validationResult;
        }
        if (membershipBeforeUpdate.birthDate !== slots.birthDate) {
            validationResult = Membership.checkBirthDate(slots.birthDate);
            if (validationResult instanceof NoConstraintViolation) updatedSlots.birthDate = slots.birthDate;
            else throw validationResult;
        }
        if (membershipBeforeUpdate.email !== slots.email) {
            validationResult = Membership.checkEmail(slots.email);
            if (validationResult instanceof NoConstraintViolation) updatedSlots.email = slots.email;
            else throw validationResult;
        }
        if (membershipBeforeUpdate.phoneNumber !== slots.phoneNumber) {
            validationResult = Membership.checkPhoneNumber(slots.phoneNumber);
            if (validationResult instanceof NoConstraintViolation) updatedSlots.phoneNumber = slots.phoneNumber;
            else throw validationResult;
        }
        if (membershipBeforeUpdate.address !== slots.address) {
            validationResult = Membership.checkAddress(slots.address);
            if (validationResult instanceof NoConstraintViolation) updatedSlots.address = slots.address;
            else throw validationResult;
        }
        if (membershipBeforeUpdate.iban !== slots.iban) {
            validationResult = Membership.checkIban(slots.iban);
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
            await updateDoc(membershipDocRef, updatedSlots);
            console.log(`Property(ies) "${updatedProperties.toString()}" modified for membership record "${slots.membershipId}"`);
        } else {
            console.log(`No property value changed for membership record "${slots.membershipId}"!`);
        }
    }
};
/**
 * Delete a Firestore document from the Firestore collection "memberships"
 * @param membershipId: {string}
 * @returns {Promise<void>}
 */
Membership.destroy = async function (membershipId) {
    try {
        await deleteDoc(fsDoc(fsDb, "memberships", membershipId));
        console.log(`membership record "${membershipId}" deleted!`);
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
Membership.generateTestData = async function () {
    try {
        console.log("Generating test data...");
        const response = await fetch("../../test-data/memberships.json");
        const membershipRecs = await response.json();
        await Promise.all(membershipRecs.map(d => Membership.add(d)));
        console.log(`${membershipRecs.length} memberships saved.`);
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
};
/**
 * Clear database
 */
Membership.clearData = async function (confirmation = true) {
    if (confirm("Do you really want to delete all membership records?")) {
        try {
            console.log("Clearing test data...");
            const membershipsCollRef = fsColl(fsDb, "memberships");
            const membershipsQrySn = (await getDocs(membershipsCollRef));
            await Promise.all(membershipsQrySn.docs.map(d => Membership.destroy(d.id)))
            console.log(`${membershipsQrySn.docs.length} memberships deleted.`);
        } catch (e) {
            console.error(`${e.constructor.name}: ${e.message}`);
        }
    }
};

Membership.observeChanges = async function (membershipId) {
    try {
        // listen document changes, returning a snapshot (snapshot) on every change
        const membershipDocRef = fsDoc(fsDb, "memberships", membershipId).withConverter(Membership.converter);
        const membershipRec = (await getDoc(membershipDocRef)).data();
        return onSnapshot(membershipDocRef, function (snapshot) {
            // create object with original document data
            const originalData = { itemName: "membership", description: `${membershipRec.membershipName} (membershipId: ${membershipRec.membershipId})` };
            if (!snapshot.data()) { // removed: if snapshot has not data
                originalData.type = "REMOVED";
                createModalFromChange(originalData); // invoke modal window reporting change of original data
            } else if (JSON.stringify(membershipRec) !== JSON.stringify(snapshot.data())) {
                originalData.type = "MODIFIED";
                createModalFromChange(originalData); // invoke modal window reporting change of original data
            }
        });
    } catch (e) {
        console.error(`${e.constructor.name} : ${e.message}`);
    }
}

export default Membership;
export { ServiceEL, PlanEL };
