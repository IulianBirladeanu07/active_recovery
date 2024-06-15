import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, where } from '../services/firebase';
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
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!currentUser) return;

      try {
        console.log('Fetching meals from Firestore...');
        const mealsQuery = query(collection(db, 'meals'), where('uid', '==', currentUser.uid), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(mealsQuery);
        const meals = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: new Date(doc.data().timestamp)
        }));
        console.log('Fetched meals:', meals);

        const breakfast = meals.filter(meal => meal.meal === 'breakfast');
        const lunch = meals.filter(meal => meal.meal === 'lunch');
        const dinner = meals.filter(meal => meal.meal === 'dinner');

        console.log('Breakfast foods:', breakfast);
        console.log('Lunch foods:', lunch);
        console.log('Dinner foods:', dinner);

        setBreakfastFoods(breakfast);
        setLunchFoods(lunch);
        setDinnerFoods(dinner);
      } catch (error) {
        console.error('Error fetching meals from Firestore:', error);
      }
    };

    fetchMeals();
  }, [currentUser]);

  const handleAddFood = async (foodDetails, meal, date) => {
    if (!currentUser) return;
  
    // Convert the date string back to a Date object
    const foodDate = new Date(date);
  
    const newFood = {
      uid: currentUser.uid,
      name: foodDetails.name,
      calories: foodDetails.calories,
      quantity: foodDetails.quantity,
      protein: foodDetails.protein,
      carbs: foodDetails.carbs,
      fat: foodDetails.fat,
      unit: foodDetails.unit,
      image: foodDetails.image,
      meal,
      timestamp: foodDate.toISOString(), // Store the date in ISO format for Firestore
    };
  
    try {
      console.log('Adding new food to Firestore:', newFood);
      const docRef = await addDoc(collection(db, 'meals'), newFood);
      newFood.id = docRef.id; // Assign the Firestore document ID to the new food
      newFood.date = foodDate; // Add the date field for local state
  
      console.log('New food added with ID:', newFood.id);
  
      // Update the state based on the meal type
      if (meal === 'breakfast') {
        setBreakfastFoods((prevFoods) => [...prevFoods, newFood]);
      } else if (meal === 'lunch') {
        setLunchFoods((prevFoods) => [...prevFoods, newFood]);
      } else if (meal === 'dinner') {
        setDinnerFoods((prevFoods) => [...prevFoods, newFood]);
      }
    } catch (error) {
      console.error('Error adding food to Firestore:', error);
    }
  };

  const handleUpdateFood = async (updatedFood) => {
    if (!currentUser || updatedFood.uid !== currentUser.uid) return;

    try {
      const foodRef = doc(db, 'meals', updatedFood.id);
      console.log('Updating food in Firestore:', updatedFood);
      await updateDoc(foodRef, updatedFood);

      setBreakfastFoods((prevFoods) =>
        prevFoods.map((food) => (food.id === updatedFood.id ? updatedFood : food))
      );
      setLunchFoods((prevFoods) =>
        prevFoods.map((food) => (food.id === updatedFood.id ? updatedFood : food))
      );
      setDinnerFoods((prevFoods) =>
        prevFoods.map((food) => (food.id === updatedFood.id ? updatedFood : food))
      );
    } catch (error) {
      console.error('Error updating food in Firestore:', error);
    }
  };

  const handleDeleteFood = async (id, meal) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'meals', id));
      if (meal === 'breakfast') {
        setBreakfastFoods((prevFoods) => prevFoods.filter(food => food.id !== id));
      } else if (meal === 'lunch') {
        setLunchFoods((prevFoods) => prevFoods.filter(food => food.id !== id));
      } else if (meal === 'dinner') {
        setDinnerFoods((prevFoods) => prevFoods.filter(food => food.id !== id));
      }
    } catch (error) {
      console.error('Error deleting food from Firestore:', error);
    }
  };

  const fetchWeeklyCalorieData = async () => {
    if (!currentUser) return;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const pastWeek = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate() - 6);

    const mealsQuery = query(collection(db, 'meals'), where('uid', '==', currentUser.uid), where('timestamp', '>=', pastWeek.toISOString()), orderBy('timestamp', 'asc'));

    const snapshot = await getDocs(mealsQuery);

    const weekMeals = snapshot.docs.map(doc => {
      const data = doc.data();
      const date = new Date(data.timestamp);
      return { ...data, date };
    });

    const dailyCalories = Array(7).fill(0);
    weekMeals.forEach(meal => {
      const dayIndex = Math.floor((meal.date - pastWeek) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        const mealCalories = parseFloat(meal.calories);
        if (!isNaN(mealCalories)) {
          dailyCalories[dayIndex] += mealCalories;
        } else {
          console.log('Invalid calorie value:', meal.calories);
        }
      }
    });
    console.log('Final dailyCalories:', dailyCalories);
    return dailyCalories;
  };

  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddFood, handleUpdateFood, handleDeleteFood, fetchWeeklyCalorieData }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
