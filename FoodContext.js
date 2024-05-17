import React, { createContext, useContext, useState } from 'react';

const FoodContext = createContext();

export const useFoodContext = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);

  const handleAddFood = (foodDetails, meal) => {
    const newFood = {
      name: foodDetails.name,
      calories: foodDetails.calories,
      quantity: foodDetails.quantity,
      unit: foodDetails.unit,
      image: foodDetails.image,
    };

    if (meal === 'breakfast') {
      setBreakfastFoods((prevFoods) => [...prevFoods, newFood]);
    } else if (meal === 'lunch') {
      setLunchFoods((prevFoods) => [...prevFoods, newFood]);
    } else if (meal === 'dinner') {
      setDinnerFoods((prevFoods) => [...prevFoods, newFood]);
    }
  };

  return (
    <FoodContext.Provider value={{ breakfastFoods, lunchFoods, dinnerFoods, handleAddFood }}>
      {children}
    </FoodContext.Provider>
  );
};
