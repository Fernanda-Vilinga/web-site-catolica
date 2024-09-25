
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpkIKZo7LoeOmozJNCcm6SaiN4ImnKb7U",
  authDomain: "ekklesia-6aa62.firebaseapp.com",
  projectId: "ekklesia-6aa62",
  storageBucket: "ekklesia-6aa62.appspot.com",
  messagingSenderId: "91789490626",
  appId: "1:91789490626:web:5484f1d72551e55bf1be5b",
  measurementId: "G-C0PNP1SK7V"
};

const app = initializeApp(firebaseConfig);
const dbFirestore = getFirestore(app);

export { dbFirestore };
