/**
 * @fileOverview  Initializing Cloud Firestore access
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";

// TODO: Replace the following with your web app's Firebase project configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};
// Initialize a Firebase App object
initializeApp( firebaseConfig);
// Initialize Cloud Firestore interface
const fsDb = getFirestore();

export { fsDb };
