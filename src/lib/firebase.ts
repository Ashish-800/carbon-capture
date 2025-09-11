// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-7069037488-eb691",
  appId: "1:438351077952:web:31b656cc4e902c198235a5",
  storageBucket: "studio-7069037488-eb691.firebasestorage.app",
  apiKey: "AIzaSyAu_ZnzskY8qjf9iq7cu6VZ43WHzkX61fw",
  authDomain: "studio-7069037488-eb691.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "438351077952",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
