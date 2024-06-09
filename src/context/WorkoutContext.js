import React, { createContext, useState, useEffect, useCallback } from 'react';
import { countWorkoutsThisWeek, getLastWorkout, fetchTemplatesFromFirestore } from '../handlers/WorkoutHandler'
import { getDocs, collection, db } from '../services/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
    const [lastWorkout, setLastWorkout] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [userSettings, setUserSettingsState] = useState({
        targetCalories: 2000,
        targetProtein: 150,
        targetFats: 70,
        targetCarbs: 250,
    });

    const setUserSettings = (settings) => {
        setUserSettingsState((prevSettings) => ({
            ...prevSettings,
            ...settings,
        }));
    };

    const fetchData = useCallback(async () => {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const workoutCount = await countWorkoutsThisWeek();
                const lastWorkoutData = await getLastWorkout();
                setWorkoutsThisWeek(workoutCount);
                setLastWorkout(lastWorkoutData);
                console.log('Data refreshed.');
            } else {
                // User is not logged in, reset data to default values
                setWorkoutsThisWeek(0);
                setLastWorkout(null);
                console.log('User not logged in');
            }
        } catch (error) {
            console.error('Error refreshing data:', error.message);
        }
    }, []);

    const fetchWorkoutHistory = useCallback(async () => {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.error('User not authenticated.');
            return;
        }

        const uid = user.uid;
        const querySnapshot = await getDocs(collection(db, 'Workouts'));
        const workoutList = [];
        querySnapshot.forEach((doc) => {
            const workoutData = doc.data();
            if (workoutData.uid === uid) {
                workoutList.push(workoutData);
            }
        });
        workoutList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setWorkoutHistory(workoutList);
    }, []);

    const fetchTemplates = useCallback(async () => {
        const fetchedTemplates = await fetchTemplatesFromFirestore();
        setTemplates(fetchedTemplates);
    }, []);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                fetchData();
                fetchWorkoutHistory();
                fetchTemplates();
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, [fetchData, fetchWorkoutHistory, fetchTemplates]);

    const refreshAllData = useCallback(() => {
        fetchData();
        fetchWorkoutHistory();
        fetchTemplates();
    }, [fetchData, fetchWorkoutHistory, fetchTemplates]);

    return (
        <WorkoutContext.Provider value={{
            workoutsThisWeek, lastWorkout, workoutHistory, templates, refreshAllData, userSettings, setUserSettings
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};
