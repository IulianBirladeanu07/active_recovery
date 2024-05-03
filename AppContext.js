import React, { createContext, useState, useEffect } from 'react';
import { countWorkoutsThisWeek, getLastWorkout, fetchTemplatesFromFirestore} from './src/screens/workout_screens/StartWorkout/WorkoutHandler';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {getDocs, collection, db, } from './src/services/firebase'
export const AppContext = createContext();

// AppProvider.js

export const AppProvider = ({ children }) => {
    const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
    const [lastWorkout, setLastWorkout] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [templates, setTemplates] = useState([]);
  
    const fetchWorkoutHistory = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          throw new Error('User not authenticated.');
        }
  
        const uid = user.uid;
  
        const querySnapshot = await getDocs(collection(db, 'Workouts'));
        const workoutList = [];
        querySnapshot.forEach((doc) => {
          const workoutData = doc.data();
          // Check if the workout data belongs to the current user
          if (workoutData.uid === uid) {
            workoutList.push(workoutData);
          }
        });
        workoutList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setWorkoutHistory(workoutList);
        console.log('WorkoutHistory fetched..')
      } catch (error) {
        console.error('Error fetching workout history:', error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await fetchTemplatesFromFirestore(); // Implement this function to fetch templates
        setTemplates(fetchedTemplates);
        console.log("WorkouTemplate fetched");
      } catch (error) {
        console.error('Error fetching templates:', error);
      }     
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            const workoutCount = await countWorkoutsThisWeek();
            const lastWorkoutData = await getLastWorkout();
            setWorkoutsThisWeek(workoutCount);
            setLastWorkout(lastWorkoutData);
            console.log('LastWorkout fetched');
          } else {
            // User is not logged in, reset data to default values
            setWorkoutsThisWeek(0);
            setLastWorkout(null);
            console.log('User not logged in');
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };
  
      // Only fetch data if the user is authenticated
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          fetchData();
          fetchWorkoutHistory(); // Prefetch workout history
          fetchTemplates(); // Prefetch templates
        }
      });
  
      return () => unsubscribe(); // Cleanup function
    }, []);
  
    return (
      <AppContext.Provider value={{ workoutsThisWeek, lastWorkout, workoutHistory, templates }}>
        {children}
      </AppContext.Provider>
    );
};
