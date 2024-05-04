// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0qnELXTEW2NsJyD25rPPNtZ_8zfFfnI4",
  authDomain: "genai-interview.firebaseapp.com",
  projectId: "genai-interview",
  storageBucket: "genai-interview.appspot.com",
  messagingSenderId: "804925431186",
  appId: "1:804925431186:web:96f7f1c45e9ba72018754b",
  measurementId: "G-Z8HM0MXEF1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

