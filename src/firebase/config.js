// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore/lite"

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_Gt8r0qTf0KZiB_UsUi_CvK3jAr-oxuk",
  authDomain: "react-journal-f315f.firebaseapp.com",
  projectId: "react-journal-f315f",
  storageBucket: "react-journal-f315f.appspot.com",
  messagingSenderId: "76172310527",
  appId: "1:76172310527:web:87a3c4f7c661a347d799ca",
  measurementId: "G-STRTWL38SK",
}

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
export const FirebaseAuth = getAuth(FirebaseApp)
export const FirebaseDB = getFirestore(FirebaseApp)
