import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user);
      if (user) {
        await user.reload();
        const updatedUser = firebase.auth().currentUser;
        console.log('Updated user:', updatedUser);

        if (updatedUser.emailVerified) {
          console.log('Email is verified');
          const userDoc = await firebase.firestore().collection('users').doc(updatedUser.uid).get();
          if (userDoc.exists) {
            setProfileSetupComplete(userDoc.data().profileSetupComplete);
            console.log('Profile setup complete status:', userDoc.data().profileSetupComplete);
          }
          setAuthenticated(true);
          console.log('User is authenticated');
        } else {
          console.log('Email is not verified');
          setAuthenticated(false);
          setProfileSetupComplete(false);
        }
      } else {
        console.log('No user is authenticated');
        setAuthenticated(false);
        setProfileSetupComplete(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateAuthState = (authState) => {
    setAuthenticated(authState);
  };

  const logout = async () => {
    await firebase.auth().signOut();
    setAuthenticated(false);
    setProfileSetupComplete(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, loading, profileSetupComplete, setProfileSetupComplete, updateAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
