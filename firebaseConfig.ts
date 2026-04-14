// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK3VS8-QwXoKWuwtnr_WM6yH_Vu5FBJCQ",
  authDomain: "help-each-other-andriod.firebaseapp.com",
  projectId: "help-each-other-andriod",
  storageBucket: "help-each-other-andriod.firebasestorage.app",
  messagingSenderId: "739969200621",
  appId: "1:739969200621:web:6e70c34991d3a7545d77e4",
  measurementId: "G-1MTGK36GQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);