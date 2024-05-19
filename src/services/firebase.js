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

const signUpWithEmailAndPassword = async (email, password) => {
  const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
  await response.user.sendEmailVerification();
  console.log('Verification email sent to:', email);
};

const signInWithEmailAndPassword = async (email, password, navigation) => {
  const response = await firebase.auth().signInWithEmailAndPassword(email, password);
  const user = response.user;
  if (user.emailVerified) {
    navigation.navigate('Home');
  } else {
    throw new Error('Please verify your email before logging in. Check your inbox for a verification email.');
  }
};

export { signUpWithEmailAndPassword, signInWithEmailAndPassword, db, collection, addDoc, setDoc, doc, getDocs, getDoc, query, where, orderBy, limit, FieldValue, deleteDoc, updateDoc }; // Export db reference
