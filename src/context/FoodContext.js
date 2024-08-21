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
  const [loading, setLoading] = useState(true);  // New state to track loading

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        preloadMeals(user);  // Preload meals when the user is authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const preloadMeals = useCallback(async (user) => {
    if (!user) return;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    try {
      const meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      const mealsRef = collection(db, 'meals');
      const q = query(
        mealsRef,
        where('uid', '==', user.uid),
        where('date', '==', formattedDate),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const timestamp = data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000) : null;

        if (timestamp) {
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
        }
      });

      setBreakfastFoods(meals.breakfast);
      setLunchFoods(meals.lunch);
      setDinnerFoods(meals.dinner);
      setLoading(false);  // Set loading to false when data is preloaded

    } catch (error) {
      console.error('Error preloading meals:', error);
      setLoading(false);
    }
  }, []);

  const fetchMeals = useCallback(async (date) => {
    if (!currentUser) return;
  
    const validDate = date instanceof Date ? date : new Date();
    const formattedDate = validDate.toISOString().split('T')[0];
  
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
        where('date', '==', formattedDate),
        orderBy('timestamp', 'desc')
      );
  
      const querySnapshot = await getDocs(q);
  
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const timestamp = data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000) : null;
  
        if (timestamp) {
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
        }
      });
  
      setBreakfastFoods(meals.breakfast);
      setLunchFoods(meals.lunch);
      setDinnerFoods(meals.dinner);
  
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  }, [currentUser]);
  
  const handleAddMeal = useCallback(async (mealType, foods) => {
    if (!currentUser) return;
  
    const mealDate = new Date().toISOString().split('T')[0];
    const foodTimestamp = firebase.firestore.Timestamp.now();
  
    try {
      const mealPromises = foods.map(async (foodDetails) => {
        const mealDocumentId = `${mealDate}_${foodDetails.name}_${Math.random().toString(36).substring(7)}`;
  
        // Prepare meal data for the meals collection
        const mealData = {
          date: mealDate,
          uid: currentUser.uid,
          mealType,
          ...foodDetails,
          timestamp: foodTimestamp,
        };
  
        // Add the meal data to the meals collection
        await setDoc(doc(db, 'meals', mealDocumentId), mealData);
  
        // Update the food's tracking information (lastAdded, numberOfTimesAdded, liked)
        const foodRef = doc(db, 'foods', foodDetails.id);
        await updateDoc(foodRef, {
          lastAdded: foodTimestamp,
          numberOfTimesAdded: firebase.firestore.FieldValue.increment(1),
          ...(foodDetails.liked !== undefined && { liked: foodDetails.liked }),
        });
  
        return { ...mealData, id: mealDocumentId };
      });
  
      const addedMeals = await Promise.all(mealPromises);
  
      // Update the state based on the meal type
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
  }, [currentUser]);
  

  const handleDeleteMeal = useCallback(async (mealType, mealDocumentId) => {
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
  }, [currentUser]);

  const fetchWeeklyCalorieData = useCallback(async () => {
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
  }, [currentUser]);

  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddMeal, handleDeleteMeal, fetchMeals, fetchWeeklyCalorieData, loading }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
