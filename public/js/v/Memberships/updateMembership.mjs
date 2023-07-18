/**
 * @fileOverview  View methods for the use case "update Membership"
 * @author Elias George
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/

import Membership, { ServiceEL, PlanEL } from "../../m/Membership.mjs";
import { fillSelectWithOptions } from "../../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../../lib/util.mjs";
import { undisplayAllSegmentFields, displaySegmentFields } from "../../c/app.mjs"

/***************************************************************
 Load data
 ***************************************************************/
const MembershipRecords = await Membership.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Membership"],
    updateButton = formEl["commit"],
    selectMembershipDurationEl = formEl.duration,
    selectMembershipAccessEl = formEl.membershipAccess,
    selectMembershipEl = formEl.selectMembership;
let cancelListener = null;
// set up the duration and membership Access selection list
fillSelectWithOptions(formEl.duration, PlanEL.labels);
fillSelectWithOptions(formEl.membershipAccess, ServiceEL.labels);


// add event listeners for responsive validation
formEl["membershipName"].addEventListener("input", function () {
    formEl["membershipName"].setCustomValidity(Membership.checkMembershipName(formEl["membershipName"].value).message);
    formEl["membershipName"].reportValidity();
});
formEl["price"].addEventListener("input", function () {
    formEl["price"].setCustomValidity(Membership.checkPrice(formEl["price"].value).message);
    formEl["price"].reportValidity();
});
formEl["duration"].addEventListener("input", function () {
    formEl["duration"].setCustomValidity(Membership.checkDuration(formEl["duration"].value).message);
    formEl["duration"].reportValidity();
});

formEl["membershipAccess"].addEventListener("input", function () {
    formEl["membershipAccess"].setCustomValidity(Membership.checkMembershipAccess(formEl["membershipAccess"].value).message);
    formEl["membershipAccess"].reportValidity();
});

/***************************************************************
 Set up select element
 ***************************************************************/
// fill select with options
const optionEl = document.createElement("option");
optionEl.text = "---";
optionEl.value = 0;
for (const MembershipRec of MembershipRecords) {
    console.log("selection " + MembershipRec.membershipId);
    const optionEl = document.createElement("option");
    optionEl.text = MembershipRec.membershipName;
    optionEl.value = MembershipRec.membershipId;
    selectMembershipEl.add(optionEl, null);
}
// when a Member is selected, fill the form with its data
selectMembershipEl.addEventListener("change", async function () {
    let membership = null;
    if (cancelListener) cancelListener();
    const membershipId = selectMembershipEl.value;
    if (membershipId) {
        // retrieve up-to-date person record
        cancelListener = await Membership.observeChanges(membershipId);
        const membershipRecord = await Membership.retrieve(membershipId);
        for (const field of ["membershipId", "membershipName", "price", "duration", "membershipAccess"]) {
            if (field === "membershipAccess") {
                formEl[field].values = membershipRecord[field];
            }
            else
                formEl[field].value = membershipRecord[field] !== undefined ? membershipRecord[field] : "";
            // delete custom validation error message which may have been set before
            formEl[field].setCustomValidity("");
        }
    } else {
        formEl.reset();
    }
});

/******************************************************************
 Add event listeners for the update/submit button
 ******************************************************************/
// set an event handler for the update button
updateButton.addEventListener("click", async function () {
    if (cancelListener) cancelListener();
    const formEl = document.forms["Membership"];
    const selectedMembershipAccess = formEl["membershipAccess"].selectedOptions;
    const slots = {
        membershipId: formEl["membershipId"].value,
        membershipName: formEl["membershipName"].value,
        price: formEl["price"].value,
        duration: formEl["duration"].value,
        membershipAccess: formEl["duration"].value,
        membershipAccess: []
    }
    // construct the list of selected membershipAccess
    for (const o of selectedMembershipAccess) {
        slots.membershipAccess.push(parseInt(o.value));
    }
    // set error messages in case of constraint violations
    formEl["membershipName"].addEventListener("input", function () {
        formEl["membershipName"].setCustomValidity(Membership.checkMembershipName(formEl["membershipName"].value).message);
        formEl["membershipName"].reportValidity();
    });
    formEl["price"].addEventListener("input", function () {
        formEl["price"].setCustomValidity(Membership.checkPrice(formEl["price"].value).message);
        formEl["price"].reportValidity();
    });
    formEl["duration"].addEventListener("input", function () {
        formEl["duration"].setCustomValidity(Membership.checkDuration(formEl["duration"].value).message);
        formEl["duration"].reportValidity();
    });

    formEl["membershipAccess"].addEventListener("input", function () {
        formEl["membershipAccess"].setCustomValidity(Membership.checkMembershipAccess(formEl["membershipAccess"].value).message);
        formEl["membershipAccess"].reportValidity();
    });

    if (formEl.checkValidity()) {
        Membership.update(slots);
        // update the selection list option element
        selectMembershipEl.options[selectMembershipEl.selectedIndex].text = slots.membershipName;
        formEl.reset();
    }
});
