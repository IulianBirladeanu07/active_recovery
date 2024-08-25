import { useMemo } from 'react';
import firebase from 'firebase/compat/app';

const useDailyNutrition = (breakfastFoods, lunchFoods, dinnerFoods, selectedDate) => {
  const calculateTotalNutrition = useMemo(() => {
    const allFoods = [...breakfastFoods, ...lunchFoods, ...dinnerFoods].filter((food) => {
      const foodDate = new Date(
        food.timestamp instanceof firebase.firestore.Timestamp
          ? food.timestamp.toDate()
          : food.timestamp
      );
      return foodDate.toDateString() === selectedDate.toDateString();
    });

    const totalCalories = allFoods.reduce(
      (total, food) => total + Number(food.Calorii),
      0
    );
    const totalProtein = allFoods.reduce(
      (total, food) => total + Number(food.Proteine),
      0
    );
    const totalCarbs = allFoods.reduce(
      (total, food) => total + Number(food.Carbohidrati),
      0
    );
    const totalFat = allFoods.reduce(
      (total, food) => total + Number(food.Grasimi),
      0
    );

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    };
  }, [breakfastFoods, lunchFoods, dinnerFoods, selectedDate]);

  return calculateTotalNutrition;
};

export default useDailyNutrition;
