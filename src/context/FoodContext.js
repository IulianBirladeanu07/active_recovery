import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, doc, setDoc, deleteDoc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from '../services/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const FoodContext = createContext();

export const useFoodContext = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        preloadMeals(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateFoods = (mealType, updatedFoods) => {
    switch (mealType) {
      case 'breakfast':
        setBreakfastFoods(updatedFoods);
        break;
      case 'lunch':
        setLunchFoods(updatedFoods);
        break;
      case 'dinner':
        setDinnerFoods(updatedFoods);
        break;
      default:
        console.error('Unknown meal type:', mealType);
    }
  };

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

      const mealTypes = ['breakfast', 'lunch', 'dinner'];

      // Fetch all meal types in parallel
      const fetchPromises = mealTypes.map(mealType => {
        const mealDocRef = doc(db, 'meals', `${formattedDate}_${mealType}_${user.uid}`);
        return getDoc(mealDocRef).then(mealDocSnap => {
          if (mealDocSnap.exists()) {
            const data = mealDocSnap.data();
            const foodsWithTimestamp = data.foods.map(food => ({ ...food, timestamp: data.timestamp }));
            meals[mealType] = foodsWithTimestamp;
          }
        });
      });

      await Promise.all(fetchPromises);

      setBreakfastFoods(meals.breakfast);
      setLunchFoods(meals.lunch);
      setDinnerFoods(meals.dinner);
      setLoading(false);

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

      const mealTypes = ['breakfast', 'lunch', 'dinner'];

      // Fetch all meal types in parallel
      const fetchPromises = mealTypes.map(mealType => {
        const mealDocRef = doc(db, 'meals', `${formattedDate}_${mealType}_${currentUser.uid}`);
        return getDoc(mealDocRef).then(mealDocSnap => {
          if (mealDocSnap.exists()) {
            const data = mealDocSnap.data();
            const foodsWithTimestamp = data.foods.map(food => ({ ...food, mealType, timestamp: data.timestamp }));
            meals[mealType] = foodsWithTimestamp;
          } else {
            console.log(`No data for ${mealType} on ${formattedDate}`);
          }
        });
      });

      await Promise.all(fetchPromises);

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
      const mealDocRef = doc(db, 'meals', `${mealDate}_${mealType}_${currentUser.uid}`);
      const mealDocSnap = await getDoc(mealDocRef);

      let existingMealData = { foods: [], date: mealDate, uid: currentUser.uid, mealType, timestamp: foodTimestamp };

      if (mealDocSnap.exists()) {
        existingMealData = mealDocSnap.data();
        if (!existingMealData.timestamp || !existingMealData.timestamp.seconds) {
          existingMealData.timestamp = foodTimestamp;
        }
      }

      const consolidatedFoods = foods.reduce((acc, food) => {
        const existingFood = acc.find(item => item.id === food.id);
        if (existingFood) {
          existingFood.quantity += food.quantity;
          existingFood.usageCount = (existingFood.usageCount || 0) + 1;
        } else {
          acc.push({ ...food, quantity: food.quantity || 1, usageCount: 1 });
        }
        return acc;
      }, existingMealData.foods);

      await setDoc(mealDocRef, {
        ...existingMealData,
        foods: consolidatedFoods,
        timestamp: foodTimestamp,
      });

      updateFoods(mealType, consolidatedFoods);

    } catch (error) {
      console.error('Error adding meal:', error);
    }
  }, [currentUser]);

  const handleDeleteMeal = useCallback(async (mealType, foodId) => {
    if (!currentUser) return;

    try {
      const mealDate = new Date().toISOString().split('T')[0];
      const mealDocRef = doc(db, 'meals', `${mealDate}_${mealType}_${currentUser.uid}`);
      const mealDocSnap = await getDoc(mealDocRef);

      if (mealDocSnap.exists()) {
        const mealData = mealDocSnap.data();
        const updatedFoods = mealData.foods.filter(food => food.id !== foodId);

        if (updatedFoods.length > 0) {
          await updateDoc(mealDocRef, { foods: updatedFoods });
        } else {
          await deleteDoc(mealDocRef);
        }

        updateFoods(mealType, updatedFoods);
      } else {
        console.error('Meal document does not exist');
      }

    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  }, [currentUser]);

  const updateMealInDatabase = async (mealType, foodId, updatedFoodDetails) => {
    if (!currentUser) return;

    const mealDate = new Date().toISOString().split('T')[0];

    try {
      const mealDocRef = doc(db, 'meals', `${mealDate}_${mealType}_${currentUser.uid}`);
      const mealDocSnap = await getDoc(mealDocRef);

      if (mealDocSnap.exists()) {
        const mealData = mealDocSnap.data();
        const updatedFoods = mealData.foods.map(food =>
          food.id === foodId ? { ...updatedFoodDetails, id: foodId, usageCount: food.usageCount || 1 } : food
        );

        await updateDoc(mealDocRef, { foods: updatedFoods });

        updateFoods(mealType, updatedFoods);
      }
    } catch (error) {
      console.error('Error updating food in the database:', error);
    }
  };

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
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddMeal, handleDeleteMeal, fetchMeals, fetchWeeklyCalorieData, loading, updateMealInDatabase, updateFoods }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
