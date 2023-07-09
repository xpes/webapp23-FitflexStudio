/**
 * @fileOverview  View methods for the use case "create Membership"
 * @author Elias George
 *
 */
/***************************************************************
 Import classes and data types
 ***************************************************************/
import Membership, { ServiceEL, PlanEL } from "../m/Membership.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";
import { showProgressBar, hideProgressBar } from "../../lib/util.mjs";


/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Membership"],
    createButton = formEl["commit"],
    progressEl = document.querySelector("progress");

// set up the movie category selection list
const createPlanSelectEl = formEl.duration;
fillSelectWithOptions(createPlanSelectEl, PlanEL.labels);

const createAccessSelectEl = formEl.membershipAccess;
fillSelectWithOptions(createAccessSelectEl, ServiceEL.labels);

// add event listeners for responsive validation
formEl["membershipId"].addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl["membershipId"].setCustomValidity(Membership.checkMembershipId(formEl["membershipId"].value).message);
    formEl["membershipId"].reportValidity();
});
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

/******************************************************************
 Add event listeners for the create/submit button
 ******************************************************************/
createButton.addEventListener("click", async function () {
    const slots = {
        membershipId: formEl["membershipId"].value,
        membershipName: formEl["membershipName"].value,
        price: formEl["price"].value,
        duration: formEl["duration"].value,
        membershipAccess: formEl["membershipAccess"].value
    };
    // check constraints and set error messages
    showProgressBar(progressEl);
    formEl["membershipId"].setCustomValidity((await Membership.checkMembershipIdAsId(slots.membershipId)).message);
    formEl["membershipName"].setCustomValidity(Membership.checkMembershipName(slots.membershipName).message);
    formEl["price"].setCustomValidity(Membership.checkPrice(slots.price).message);
    formEl["duration"].setCustomValidity(Membership.checkDuration(slots.duration).message);
    formEl["membershipAccess"].setCustomValidity(Membership.checkMembershipAccess(slots.membershipAccess).message);
    if (formEl.checkValidity()) {
        await Membership.add(slots);
        formEl.reset();
    }
    hideProgressBar(progressEl);
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});



