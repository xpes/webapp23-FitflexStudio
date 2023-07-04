/**
 * @fileOverview  Initializing Cloud Firestore access
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// TODO: Replace the following with your web app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC6RA-pBQ8i7FqiG0z5_qv39r7a_7Yye8",
    authDomain: "fitflexstudio-21.firebaseapp.com",
    projectId: "fitflexstudio-21",
    appId: "1:282483618202:web:0cbfa06568bc940da74a23",
    
};
// Initialize a Firebase App object only if not already initialized
const app = (!getApps().length) ? initializeApp(firebaseConfig) : getApp();
// Initialize Firebase Authentication
const auth = getAuth(app);
// Initialize Cloud Firestore interface
const fsDb = getFirestore();

export { auth, fsDb };
