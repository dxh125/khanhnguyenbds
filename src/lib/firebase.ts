// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtn0fWT8twz9N02VH8P1SAqPUEGATkotM",
  authDomain: "khanhnguyenbds-ff261.firebaseapp.com",
  projectId: "khanhnguyenbds-ff261",
  storageBucket: "khanhnguyenbds-ff261.firebasestorage.app",
  messagingSenderId: "227334541975",
  appId: "1:227334541975:web:66e0254246b2ecf4890fd2",
  measurementId: "G-VL3MS76LL3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);


export { auth };