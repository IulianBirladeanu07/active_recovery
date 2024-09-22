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
  const [selectedDate, setSelectedDate] = useState(new Date());  // New state for selected date

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        preloadMeals(user, selectedDate);  // Pass selectedDate to preloadMeals
      }
    });

    return () => unsubscribe();
  }, [selectedDate]);  // Add selectedDate as a dependency

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

  const preloadMeals = useCallback(async (user, date) => {
    if (!user) return;

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

  const handleAddMeal = useCallback(async (mealType, foods, selectedDate) => {
    if (!currentUser) return;
  
    const mealDate = selectedDate.split('T')[0];  // Use selectedDate as a string
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
  
      console.log("Incoming Foods:", foods);
      console.log("Existing Meal Data Foods:", existingMealData.foods);
  
      // Consolidate incoming foods with existing meal data
      const consolidatedFoods = foods.reduce((acc, food) => {
        const existingFoodIndex = acc.findIndex(item => item.id === food.id);
        if (existingFoodIndex !== -1) {
          // Update specific nutrient properties by adding values
          acc[existingFoodIndex] = {
            ...acc[existingFoodIndex], // Keep existing properties
            Calorii: (acc[existingFoodIndex].Calorii || 0) + (food.Calorii || 0), // Add Calorii
            Carbohidrati: (acc[existingFoodIndex].Carbohidrati || 0) + (food.Carbohidrati || 0), // Add Carbohidrati
            Grasimi: (acc[existingFoodIndex].Grasimi || 0) + (food.Grasimi || 0), // Add Grasimi
            Proteine: (acc[existingFoodIndex].Proteine || 0) + (food.Proteine || 0), // Add Proteine
            Fibre: (acc[existingFoodIndex].Fibre || 0) + (food.Fibre || 0), // Add Fibre
            Zaharuri: (acc[existingFoodIndex].Zaharuri || 0) + (food.Zaharuri || 0), // Add Zaharuri
            Sare: (acc[existingFoodIndex].Sare || 0) + (food.Sare || 0), // Add Sare
            Grasimi_Saturate: (acc[existingFoodIndex].Grasimi_Saturate || 0) + (food.Grasimi_Saturate || 0), // Add Grasimi Saturate
            usageCount: (acc[existingFoodIndex].usageCount || 0) + 1 // Increment usageCount
          };
        } else {
          // Add new food item
          acc.push({ ...food, quantity: food.quantity || 1, usageCount: 1 });
        }
        return acc;
      }, existingMealData.foods || []);
  
      console.log("Consolidated Foods:", consolidatedFoods);
  
      await setDoc(mealDocRef, {
        ...existingMealData,
        foods: consolidatedFoods,
        timestamp: foodTimestamp,
      });
  
      console.log(`Meal ${mealType} updated successfully.`);
      updateFoods(mealType, consolidatedFoods);
  
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  }, [currentUser, selectedDate, updateFoods]);
  
  const handleDeleteMeal = useCallback(async (mealType, foodId) => {
    if (!currentUser) return;

    try {
      const mealDate = selectedDate.toISOString().split('T')[0];  // Use selectedDate instead of new Date()
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
  }, [currentUser, selectedDate]);

  const updateMealInDatabase = async (mealType, foodId, updatedFoodDetails) => {
    if (!currentUser) {
      console.log('No current user logged in.');
      return;
    }
  
    const mealDate = selectedDate.toISOString().split('T')[0];  // Use selectedDate instead of new Date()
    console.log(`Updating meal for date: ${mealDate}, type: ${mealType}, user: ${currentUser.uid}`);
  
    try {
      const mealDocRef = doc(db, 'meals', `${mealDate}_${mealType}_${currentUser.uid}`);
      console.log(`Document reference created: ${mealDocRef.path}`);
  
      const mealDocSnap = await getDoc(mealDocRef);
      console.log('Fetched meal document snapshot:', mealDocSnap.exists());
  
      if (mealDocSnap.exists()) {
        const mealData = mealDocSnap.data();
        console.log('Current meal data:', mealData);
  
        const updatedFoods = mealData.foods.map(food =>
          food.id === foodId ? { ...updatedFoodDetails, id: foodId, usageCount: food.usageCount || 1 } : food
        );
        console.log('Updated foods list:', updatedFoods);
  
        await updateDoc(mealDocRef, { foods: updatedFoods });
        console.log('Document updated successfully.');
  
        updateFoods(mealType, updatedFoods);
        console.log('Foods updated in state.');
      } else {
        console.log('Meal document does not exist.');
      }
    } catch (error) {
      console.error('Error updating food in the database:', error);
    }
  };
  

  const handlePlusPress = async (item) => {
    if (!currentUser) return;
  
    const mealDate = selectedDate.split('T')[0];
    const mealDocRef = doc(db, 'meals', `${mealDate}_${meal}_${currentUser.uid}`);
  
    try {
      // Fetch existing meal data
      const mealDocSnap = await getDoc(mealDocRef);
      let mealData = { foods: [], date: mealDate, uid: currentUser.uid, mealType: meal, timestamp: firebase.firestore.Timestamp.now() };
  
      if (mealDocSnap.exists()) {
        mealData = mealDocSnap.data();
        if (!mealData.timestamp || !mealData.timestamp.seconds) {
          mealData.timestamp = firebase.firestore.Timestamp.now();
        }
      }
  
      // Check if the item already exists in the meal
      const existingFood = mealData.foods.find(f => f.id === item.id);
  
      if (existingFood) {
        // Item exists, update its quantity
        const updatedFoods = mealData.foods.map(food =>
          food.id === item.id
            ? { ...food, quantity: food.quantity + 1, usageCount: (food.usageCount || 0) + 1 }
            : food
        );
  
        await updateDoc(mealDocRef, { foods: updatedFoods, timestamp: mealData.timestamp });
      } else {
        // Item does not exist, add it
        const newFood = { ...item, quantity: 1, usageCount: 1 };
        const updatedFoods = [...mealData.foods, newFood];
  
        await setDoc(mealDocRef, { ...mealData, foods: updatedFoods, timestamp: mealData.timestamp });
      }
  
      // Optionally, update your global state or context
      console.log(`Meal ${meal} updated successfully.`);
    } catch (error) {
      console.error('Error updating meal:', error);
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

  const addMultipleFoods = async (mealType, foods) => {
    if (!currentUser) return;

    const mealDate = selectedDate.toISOString().split('T')[0];  // Use selectedDate instead of new Date()
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
      console.error('Error adding multiple foods:', error);
    }
  };

  return (
    <FoodContext.Provider value={{
      breakfastFoods,
      lunchFoods,
      dinnerFoods,
      handleAddMeal,
      handleDeleteMeal,
      fetchMeals,
      fetchWeeklyCalorieData,
      loading,
      updateMealInDatabase,
      handlePlusPress,
      updateFoods,
      addMultipleFoods,
      selectedDate,   // Expose selectedDate
      setSelectedDate // Expose function to update selectedDate
    }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
