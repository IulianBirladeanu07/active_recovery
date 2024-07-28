import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const signInWithEmailAndPassword = async (email, password, navigation, setProfileSetupComplete, updateAuthState) => {
  try {
    const response = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = response.user;

    await user.reload();
    const updatedUser = firebase.auth().currentUser;

    if (!updatedUser.emailVerified) {
      throw new Error('Please verify your email before logging in. Check your inbox for a verification email.');
    }

    const userDoc = await firebase.firestore().collection('users').doc(updatedUser.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      setProfileSetupComplete(userData.profileSetupComplete);
      updateAuthState(true); // Set authenticated to true immediately after successful login

      if (!userData.profileSetupComplete) {
        navigation.navigate('StepByStepProfileSetup');
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthenticatedScreens', params: { screen: 'Home' } }],
        });
      }
    } else {
      throw new Error('User data not found.');
    }
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

const signUpWithEmailAndPassword = async (email, password) => {
  const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
  await response.user.sendEmailVerification();
  await firebase.firestore().collection('users').doc(response.user.uid).set({
    email: response.user.email,
    profileSetupComplete: false,
  });
};

const sendPasswordResetEmail = async (email) => {
  await firebase.auth().sendPasswordResetEmail(email);
};

const signOutUser = async () => {
  await firebase.auth().signOut();
};

export { signUpWithEmailAndPassword, signInWithEmailAndPassword, signOutUser, sendPasswordResetEmail };
