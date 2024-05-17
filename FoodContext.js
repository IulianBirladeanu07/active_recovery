import React, { createContext, useContext, useState } from 'react';

// Create a context for food management
const FoodContext = createContext();

// Custom hook to use the FoodContext
export const useFoodContext = () => useContext(FoodContext);

// Provider component that wraps the application
export const FoodProvider = ({ children }) => {
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);

  // Function to add food to the specified meal
  const handleAddFood = (food, meal) => {
    if (meal === 'breakfast') {
      setBreakfastFoods((prevFoods) => [...prevFoods, food]);
    } else if (meal === 'lunch') {
      setLunchFoods((prevFoods) => [...prevFoods, food]);
    } else if (meal === 'dinner') {
      setDinnerFoods((prevFoods) => [...prevFoods, food]);
    }
  };

  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddFood }}>
      {children}
    </FoodContext.Provider>
  );
};
