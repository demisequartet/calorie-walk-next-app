// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFB2cIazu6rhqLDQypnMOAW1IZ9qnHiGk",
  authDomain: "vol10cc.firebaseapp.com",
  projectId: "vol10cc",
  storageBucket: "vol10cc.appspot.com",
  messagingSenderId: "744530633995",
  appId: "1:744530633995:web:c868fb8c3874288112ae0e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

