import { useState, useEffect } from 'react';

const useDailyNutrition = (breakfastFoods, lunchFoods, dinnerFoods) => {
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    const calculateTotalNutrition = () => {
      // Combine all foods from breakfast, lunch, and dinner
      const allFoods = [...breakfastFoods, ...lunchFoods, ...dinnerFoods];

      // Sum up the nutritional values
      return allFoods.reduce((totals, food) => ({
        calories: totals.calories + (Number(food.Calorii) || 0),
        protein: totals.protein + (Number(food.Proteine) || 0),
        carbs: totals.carbs + (Number(food.Carbohidrati) || 0),
        fat: totals.fat + (Number(food.Grasimi) || 0),
      }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    };

    setDailyNutrition(calculateTotalNutrition());
  }, [breakfastFoods, lunchFoods, dinnerFoods]);

  return dailyNutrition;
};

export default useDailyNutrition;
