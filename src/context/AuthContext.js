import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setAuthenticated(!!user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
