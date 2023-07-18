/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 * @author Elias George
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Person, { GenderEL, PersonRoleEL, TrainerCategoryEL } from "../../m/Person.mjs";
import Membership from "../../m/Membership.mjs";
import { fillSelectWithOptions } from "../../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";
import { undisplayAllSegmentFields, displaySegmentFields } from "../../c/app.mjs"

/***************************************************************
 Load data
 ***************************************************************/
const MembershipRecords = await Membership.retrieveAll();


/**********************************************
 * Refresh the Create person UI
 **********************************************/
var subClassProp = document.getElementsByClassName("field");
console.log(subClassProp.length);
for (let i = 0; i < subClassProp.length; i++) {
    subClassProp[i].style.display = "none";
}


/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Person"],
    createButton = formEl["commit"],
    selectMembershipTypeEl = formEl.membershipType,
    progressEl = document.querySelector("progress");

// fill select membershipType with options
const optionEl = document.createElement("option");
optionEl.text = "---";
optionEl.value = 0;
selectMembershipTypeEl.add(optionEl, null);
for (const MembershipRec of MembershipRecords) {
    console.log("selection " + MembershipRec.membershipId);
    const optionEl = document.createElement("option");
    optionEl.text = MembershipRec.membershipName;
    optionEl.value = MembershipRec.membershipId;
    selectMembershipTypeEl.add(optionEl, null);
}

// set up the selection list
const createGenderSelectEl = formEl.gender;
fillSelectWithOptions(createGenderSelectEl, GenderEL.labels);

const createRoleSelectEl = formEl.role;
fillSelectWithOptions(createRoleSelectEl, PersonRoleEL.labels);

const createTrainerSelectEl = formEl.trainerCategory;
fillSelectWithOptions(createTrainerSelectEl, TrainerCategoryEL.labels);

/**
 * event handler for role selection events
 */
function handleCategorySelectChangeEvent(e) {
    const formEl = e.currentTarget.form,
        // the array index of PersonRoleEL.labels
        categoryIndexStr = formEl.role.value;
    console.log(formEl["role"].value);
    if (categoryIndexStr) {
        displaySegmentFields(formEl, PersonRoleEL.labels,
            parseInt(categoryIndexStr));
    } else {
        undisplayAllSegmentFields(formEl, PersonRoleEL.labels);
    }
}



// add event listeners for responsive validation
formEl["personId"].addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl["personId"].setCustomValidity(Person.checkPersonId(formEl["personId"].value).message);
    formEl["personId"].reportValidity();
});
formEl["personName"].addEventListener("input", function () {
    formEl["personName"].setCustomValidity(Person.checkPersonName(formEl["personName"].value).message);
    formEl["personName"].reportValidity();
});
formEl["gender"].addEventListener("input", function () {
    formEl["gender"].setCustomValidity(Person.checkGender(formEl["gender"].value).message);
    formEl["gender"].reportValidity();
});
formEl["birthDate"].addEventListener("input", function () {
    formEl["birthDate"].setCustomValidity(Person.checkBirthDate(formEl["birthDate"].value).message);
    formEl["birthDate"].reportValidity();
});

formEl["email"].addEventListener("input", function () {
    formEl["email"].setCustomValidity(Person.checkEmail(formEl["email"].value).message);
    formEl["email"].reportValidity();
});

formEl["phoneNumber"].addEventListener("input", function () {
    formEl["phoneNumber"].setCustomValidity(Person.checkPhoneNumber(formEl["phoneNumber"].value).message);
    formEl["phoneNumber"].reportValidity();
});

formEl["address"].addEventListener("input", function () {
    formEl["address"].setCustomValidity(Person.checkAddress(formEl["address"].value).message);
    formEl["address"].reportValidity();
});
formEl["IBAN"].addEventListener("input", function () {
    formEl["IBAN"].setCustomValidity(Person.checkIban(formEl["IBAN"].value).message);
    formEl["IBAN"].reportValidity();
});
formEl["role"].addEventListener("change", handleCategorySelectChangeEvent);

formEl["trainerId"].addEventListener("input", function () {
    formEl["trainerId"].setCustomValidity(Person.checkTrainerId(formEl["trainerId"].value, formEl["role"].value).message);
    formEl["trainerId"].reportValidity();
});
formEl["trainerCategory"].addEventListener("input", function () {
    formEl["trainerCategory"].setCustomValidity(Person.checkTrainerCategory(formEl["trainerCategory"].value, formEl["role"].value).message);
    formEl["trainerCategory"].reportValidity();
});
formEl["memberId"].addEventListener("input", function () {
    formEl["memberId"].setCustomValidity(Person.checkMemberId(formEl["memberId"].value, formEl["role"].value).message);
    formEl["memberId"].reportValidity();
});
formEl["membershipType"].addEventListener("input", function () {
    formEl["membershipType"].setCustomValidity(Person.checkMembershipType(formEl["membershipType"].value, formEl["role"].value).message);
    formEl["membershipType"].reportValidity();
});


/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
    console.log("Create button");
    const slots = {
        personId: formEl["personId"].value,
        personName: formEl["personName"].value,
        gender: formEl["gender"].value,
        birthDate: formEl["birthDate"].value,
        email: formEl["email"].value,
        phoneNumber: formEl["phoneNumber"].value,
        address: formEl["address"].value,
        iban: formEl["IBAN"].value,
        role: formEl["role"].value,
        trainerId: formEl["trainerId"].value,
        trainerCategory: formEl["trainerCategory"].value,
        memberId: formEl["memberId"].value,
        membershipType: formEl["membershipType"].value
    };
    // check constraints and set error messages
    showProgressBar(progressEl);
    formEl["personId"].setCustomValidity((await Person.checkPersonIdAsId(slots.personId)).message);
    formEl["personId"].reportValidity();
    formEl["personName"].setCustomValidity(Person.checkPersonName(slots.personName).message);
    formEl["gender"].setCustomValidity(Person.checkGender(slots.gender).message);
    formEl["birthDate"].setCustomValidity(Person.checkBirthDate(slots.birthDate).message);
    formEl["email"].setCustomValidity(Person.checkEmail(slots.email).message);
    formEl["phoneNumber"].setCustomValidity(Person.checkPhoneNumber(slots.phoneNumber).message);
    formEl["address"].setCustomValidity(Person.checkAddress(slots.address).message);
    formEl["IBAN"].setCustomValidity(Person.checkIban(slots.iban).message);
    formEl["trainerId"].setCustomValidity(Person.checkTrainerId(slots.trainerId, slots.role).message);
    formEl["trainerCategory"].setCustomValidity(Person.checkTrainerCategory(slots.trainerCategory, slots.role).message);
    formEl["memberId"].setCustomValidity(Person.checkMemberId(slots.memberId, slots.role).message);
    formEl["membershipType"].setCustomValidity(Person.checkMembershipType(slots.membershipType, slots.role).message);
    if (formEl.checkValidity()) {
        await Person.add(slots);
        formEl.reset();
    }
    hideProgressBar(progressEl);
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});



