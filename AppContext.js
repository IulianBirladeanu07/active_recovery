import React, { createContext, useState, useEffect } from 'react';
import { countWorkoutsThisWeek, getLastWorkout } from './src/screens/workout_screens/StartWorkout/WorkoutHandler';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [lastWorkout, setLastWorkout] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const workoutCount = await countWorkoutsThisWeek();
          const lastWorkoutData = await getLastWorkout();
          setWorkoutsThisWeek(workoutCount);
          setLastWorkout(lastWorkoutData);

          console.log('Data fetched');
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
      }
    });

    return () => unsubscribe(); // Cleanup function

  }, []);

  return (
    <AppContext.Provider value={{ workoutsThisWeek, lastWorkout }}>
      {children}
    </AppContext.Provider>
  );
};
