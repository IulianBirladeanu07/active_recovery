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

  const preloadMeals = useCallback(async (user) => {
    if (!user) return;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    try {
      const mealTypes = ['breakfast', 'lunch', 'dinner'];
      const mealDocs = mealTypes.map(mealType => doc(db, 'meals', `${formattedDate}_${mealType}_${user.uid}`));
      const mealSnapshots = await Promise.all(mealDocs.map(docRef => getDoc(docRef)));

      const meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      mealSnapshots.forEach((mealDocSnap, index) => {
        if (mealDocSnap.exists()) {
          const mealType = mealTypes[index];
          const data = mealDocSnap.data();
          const foodsWithTimestamp = data.foods.map(food => ({ ...food, timestamp: data.timestamp }));

          meals[mealType] = foodsWithTimestamp;
        }
      });

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
      const mealTypes = ['breakfast', 'lunch', 'dinner'];
      const mealDocs = mealTypes.map(mealType => doc(db, 'meals', `${formattedDate}_${mealType}_${currentUser.uid}`));
      const mealSnapshots = await Promise.all(mealDocs.map(docRef => getDoc(docRef)));

      const meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      mealSnapshots.forEach((mealDocSnap, index) => {
        if (mealDocSnap.exists()) {
          const mealType = mealTypes[index];
          const data = mealDocSnap.data();
          const foodsWithTimestamp = data.foods.map(food => ({ ...food, mealType: mealType, timestamp: data.timestamp }));

          meals[mealType] = foodsWithTimestamp;
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
      const mealDocRef = doc(db, 'meals', `${mealDate}_${mealType}_${currentUser.uid}`);
      const mealDocSnap = await getDoc(mealDocRef);
  
      let existingMealData = { foods: [], date: mealDate, uid: currentUser.uid, mealType, timestamp: foodTimestamp };
  
      if (mealDocSnap.exists()) {
        existingMealData = mealDocSnap.data();
      }
  
      const consolidatedFoods = foods.map(newFood => {
        const existingFood = existingMealData.foods.find(item => item.Nume_Produs === newFood.Nume_Produs);
        
        if (existingFood) {
          // Update quantity and recalculate macros based on the new quantity
          const totalQuantity = existingFood.quantity + newFood.quantity;
  
          const updatedFood = {
            ...existingFood,
            quantity: totalQuantity,
            Calorii: Math.round((existingFood.Calorii / existingFood.quantity) * totalQuantity),
            Carbohidrati: Math.round((existingFood.Carbohidrati / existingFood.quantity) * totalQuantity),
            Grasimi: Math.round((existingFood.Grasimi / existingFood.quantity) * totalQuantity),
            Proteine: Math.round((existingFood.Proteine / existingFood.quantity) * totalQuantity),
            Fibre: Math.round((existingFood.Fibre / existingFood.quantity) * totalQuantity),
            Zaharuri: Math.round((existingFood.Zaharuri / existingFood.quantity) * totalQuantity),
            Sare: Math.round((existingFood.Sare / existingFood.quantity) * totalQuantity),
            Grasimi_Saturate: Math.round((existingFood.Grasimi_Saturate / existingFood.quantity) * totalQuantity),
          };
  
          return updatedFood;
        } else {
          return newFood;
        }
      });
  
      await setDoc(mealDocRef, {
        ...existingMealData,
        foods: consolidatedFoods,
        timestamp: foodTimestamp,
      });
  
      // Update the context state based on the meal type
      switch (mealType) {
        case 'breakfast':
          setBreakfastFoods(consolidatedFoods);
          break;
        case 'lunch':
          setLunchFoods(consolidatedFoods);
          break;
        case 'dinner':
          setDinnerFoods(consolidatedFoods);
          break;
        default:
          console.error('Invalid meal type');
      }
  
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
            console.error('Invalid meal type');
        }
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

  const updateMealInDatabase = async (mealType, foodId, updatedFoodDetails) => {
    if (!currentUser) return;
  
    const mealDate = new Date().toISOString().split('T')[0];
  
    try {
      const mealDocRef = doc(db, 'meals', `${mealDate}_${mealType}_${currentUser.uid}`);
      const mealDocSnap = await getDoc(mealDocRef);
  
      if (mealDocSnap.exists()) {
        const mealData = mealDocSnap.data();
        const updatedFoods = mealData.foods.map(food =>
          food.id === foodId ? { ...updatedFoodDetails, id: foodId } : food
        );
  
        await updateDoc(mealDocRef, { foods: updatedFoods });
  
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
            console.error('Invalid meal type');
        }
      }
    } catch (error) {
      console.error('Error updating food in the database:', error);
    }
  };
  
  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddMeal, handleDeleteMeal, fetchMeals, fetchWeeklyCalorieData, loading, updateMealInDatabase }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
