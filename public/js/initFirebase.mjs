/**
 * @fileOverview  Initializing Cloud Firestore access
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore }
    from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// TODO: Replace the following with your web app's Firebase project configuration
const firebaseConfig = {

};
// Initialize a Firebase App object only if not already initialized
const app = (!getApps().length) ? initializeApp(firebaseConfig) : getApp();
// Initialize Firebase Authentication
const auth = getAuth(app);
// Initialize Cloud Firestore interface
const fsDb = getFirestore();

export { auth, fsDb };
