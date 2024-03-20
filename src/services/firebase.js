import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

export { signUpWithEmailAndPassword, signInWithEmailAndPassword };
