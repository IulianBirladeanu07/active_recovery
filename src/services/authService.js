import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const signUpWithEmailAndPassword = async (email, password) => {
  const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
  await response.user.sendEmailVerification();
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