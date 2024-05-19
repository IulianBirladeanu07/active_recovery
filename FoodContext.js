import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from './src/services/firebase';

const FoodContext = createContext();

export const useFoodContext = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        console.log('Fetching meals from Firestore...');
        const mealsQuery = query(collection(db, 'meals'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(mealsQuery);
        const meals = snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, date: new Date(data.timestamp) };
        });
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
  }, []);

  const handleAddFood = async (foodDetails, meal, date) => {
    const newFood = {
      name: foodDetails.name,
      calories: foodDetails.calories,
      quantity: foodDetails.quantity,
      protein: foodDetails.protein,
      carbs: foodDetails.carbs,
      fat: foodDetails.fat,
      unit: foodDetails.unit,
      image: foodDetails.image,
      meal,
      timestamp: new Date(date).toISOString(),
    };
    try {
      console.log('Adding new food to Firestore:', newFood);
      const docRef = await addDoc(collection(db, 'meals'), newFood);
      newFood.id = docRef.id; // Assign the Firestore document ID to the new food
      newFood.date = new Date(newFood.timestamp); // Add the date field for local state

      console.log('New food added with ID:', newFood.id);

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

  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddFood, handleUpdateFood, handleDeleteFood }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;
