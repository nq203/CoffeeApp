// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where ,orderBy } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzZrW3FjY3Awh7vJnbFLzSDQ7AsVwIFJ4",
  authDomain: "coffee-app-b5db8.firebaseapp.com",
  projectId: "coffee-app-b5db8",
  storageBucket: "coffee-app-b5db8.firebasestorage.app",
  messagingSenderId: "750619589320",
  appId: "1:750619589320:web:cd88c9841cf403aa4943fd",
  measurementId: "G-WQK20S4LYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { db,auth, collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where ,storage, orderBy};