import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, doc, setDoc, deleteDoc, query, collection, where, orderBy, getDocs } from '../services/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const FoodContext = createContext();

export const useFoodContext = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMeals = useCallback(async (date) => {
    if (!currentUser) return;
  
    // Use current date if no date is provided
    const validDate = date instanceof Date ? date : new Date();
  
    const formattedDate = validDate.toISOString().split('T')[0]; // Get the selected date in 'YYYY-MM-DD' format
  
    try {
      const meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };
  
      const mealsRef = collection(db, 'meals');
      const q = query(
        mealsRef,
        where('uid', '==', currentUser.uid),
        where('date', '==', formattedDate), // Filter by the selected date
        orderBy('timestamp', 'desc')
      );
  
      const querySnapshot = await getDocs(q);
  
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const rawTimestamp = data.timestamp;
  
        if (rawTimestamp && rawTimestamp.seconds !== undefined) {
          const timestamp = new Date(rawTimestamp.seconds * 1000);
          const mealWithTimestamp = { id: doc.id, ...data, timestamp };
  
          switch (data.mealType) {
            case 'breakfast':
              meals.breakfast.push(mealWithTimestamp);
              break;
            case 'lunch':
              meals.lunch.push(mealWithTimestamp);
              break;
            case 'dinner':
              meals.dinner.push(mealWithTimestamp);
              break;
            default:
              console.error(`Unknown meal type: ${data.mealType}`);
          }
        } else {
          console.error(`Food item ${data.name || doc.id} has an invalid or missing timestamp.`);
        }
      });
  
      setBreakfastFoods(meals.breakfast);
      setLunchFoods(meals.lunch);
      setDinnerFoods(meals.dinner);
  
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  }, [currentUser]);
  

  const handleAddMeal = async (mealType, foods) => {
    if (!currentUser) return;

    const mealDate = new Date().toISOString().split('T')[0];
    const foodTimestamp = firebase.firestore.Timestamp.now();

    try {
      const mealPromises = foods.map(async (foodDetails) => {
        const mealDocumentId = `${mealDate}_${foodDetails.name}_${Math.random().toString(36).substring(7)}`;

        const mealData = {
          date: mealDate,
          uid: currentUser.uid,
          mealType,  // Specify the meal type here
          ...foodDetails,
          timestamp: foodTimestamp,
        };

        await setDoc(doc(db, 'meals', mealDocumentId), mealData);

        return { ...mealData, id: mealDocumentId };
      });

      const addedMeals = await Promise.all(mealPromises);

      switch (mealType) {
        case 'breakfast':
          setBreakfastFoods(prevFoods => [...prevFoods, ...addedMeals]);
          break;
        case 'lunch':
          setLunchFoods(prevFoods => [...prevFoods, ...addedMeals]);
          break;
        case 'dinner':
          setDinnerFoods(prevFoods => [...prevFoods, ...addedMeals]);
          break;
        default:
          console.error('Invalid meal type');
      }

    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const handleDeleteMeal = async (mealType, mealDocumentId) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'meals', mealDocumentId));

      switch (mealType) {
        case 'breakfast':
          setBreakfastFoods(prevFoods => prevFoods.filter(food => food.id !== mealDocumentId));
          break;
        case 'lunch':
          setLunchFoods(prevFoods => prevFoods.filter(food => food.id !== mealDocumentId));
          break;
        case 'dinner':
          setDinnerFoods(prevFoods => prevFoods.filter(food => food.id !== mealDocumentId));
          break;
        default:
          console.error('Invalid meal type');
      }

    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const fetchWeeklyCalorieData = async () => {
    if (!currentUser) return;

    const todayUTC = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
    const pastWeekUTC = new Date(Date.UTC(todayUTC.getFullYear(), todayUTC.getMonth(), todayUTC.getDate() - 6));

    try {
      const mealsRef = collection(db, 'meals');
      const mealsQuery = query(
        mealsRef,
        where('uid', '==', currentUser.uid),
        where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(pastWeekUTC)),
        orderBy('timestamp', 'asc')
      );

      const snapshot = await getDocs(mealsQuery);
      const dailyCalories = Array(7).fill(0);

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const timestamp = new Date(data.timestamp.seconds * 1000);
        const dayIndex = Math.floor((timestamp - pastWeekUTC) / (1000 * 60 * 60 * 24));

        if (dayIndex >= 0 && dayIndex < 7) {
          const mealCalories = parseFloat(data.calories);
          if (!isNaN(mealCalories)) {
            dailyCalories[dayIndex] += mealCalories;
          } else {
            console.log('Invalid calorie value:', data.calories);
          }
        }
      });

      return dailyCalories;

    } catch (error) {
      console.error('Error fetching weekly calories:', error);
    }
  };

  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddMeal, handleDeleteMeal, fetchMeals, fetchWeeklyCalorieData }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
