/**
 * @fileOverview  Initializing Cloud Firestore access
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
import { initializeApp, getApp, getApps }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { getAuth }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

  // TODO: Replace the following with your web app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCz-hG89E-P57sdYFQC3PH6j8DvBx_FOXU",
    authDomain: "fitflexstudio-12345.firebaseapp.com",
    projectId: "fitflexstudio-12345",
    appId: "1:631078771763:web:65ca2e707bb3444bb6d746"
  };
  

// Initialize a Firebase App object only if not already initialized
const app = (!getApps().length) ? initializeApp( config ) : getApp();
// Initialize Firebase Authentication
const auth = getAuth( app);
// Initialize Cloud Firestore interface
const fsDb = getFirestore();

export { auth, fsDb };