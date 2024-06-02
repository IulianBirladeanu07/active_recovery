import { useState, useEffect } from 'react';

const useDailyNutrition = (breakfastFoods, lunchFoods, dinnerFoods, selectedDate) => {
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    const calculateTotalNutrition = () => {
      const allFoods = [...breakfastFoods, ...lunchFoods, ...dinnerFoods].filter(
        (food) => new Date(food.date).toDateString() === selectedDate.toDateString()
      );
      const totalCalories = allFoods.reduce((total, food) => total + Number(food.calories), 0);
      const totalProtein = allFoods.reduce((total, food) => total + Number(food.protein), 0);
      const totalCarbs = allFoods.reduce((total, food) => total + Number(food.carbs), 0);
      const totalFat = allFoods.reduce((total, food) => total + Number(food.fat), 0);

      return {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      };
    };

    const totalNutrition = calculateTotalNutrition();
    setDailyNutrition(totalNutrition);
  }, [breakfastFoods, lunchFoods, dinnerFoods, selectedDate]);

  return dailyNutrition;
};

export default useDailyNutrition;
