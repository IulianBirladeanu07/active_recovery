import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, FieldValue, deleteDoc, updateDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCATfdd7eYlQhTyx2GAFX5OvHS3qKBnVuc",
  authDomain: "activerecovery-3a400.firebaseapp.com",
  projectId: "activerecovery-3a400",
  storageBucket: "activerecovery-3a400.appspot.com",
  messagingSenderId: "208634985017",
  appId: "1:208634985017:web:ff62b269645670672fabe8",
  measurementId: "G-G9EHVBG5ZG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// Create Firestore database reference
const db = getFirestore(app);

export { db, collection, addDoc, setDoc, doc, getDocs, getDoc, query, where, orderBy, limit, FieldValue, deleteDoc, updateDoc }; // Export db reference