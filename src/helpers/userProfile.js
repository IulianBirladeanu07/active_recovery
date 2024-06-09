// firebaseHelpers.js

import firebase from 'firebase/compat/app';
import { db, collection, setDoc, doc, getDoc } from '../services/firebase'

export const saveUserProfile = async (uid, profileData) => {
    try {
      const userDocRef = doc(collection(db, 'Users'), uid);
      await setDoc(userDocRef, profileData, { merge: true });
      console.log('Profile data saved successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error.message);
      throw new Error('Failed to save profile data');
    }
  };
  
  export const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(collection(db, 'Users'), uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
      throw new Error('Failed to fetch profile data');
    }
  };