import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ApplicationCustomScreen from '../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import { useFoodContext } from '../../context/FoodContext';
import CircularProgress from '../../components/CircularProgress/CircularProgress';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import MealContainer from '../../components/NutritionItem/MealContainer';
import useDailyNutrition from '../../helpers/useDailyNutrtion';
import styles from './NutritionScreenStyles';
import { WorkoutContext } from '../../context/WorkoutContext';

const NutritionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userSettings } = useContext(WorkoutContext);
  const { breakfastFoods, lunchFoods, dinnerFoods, handleAddFood, handleDeleteFood } = useFoodContext();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dailyNutrition = useDailyNutrition(breakfastFoods, lunchFoods, dinnerFoods, selectedDate);
  const { targetCalories, targetProtein, targetFats, targetCarbs } = userSettings;

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  useEffect(() => {
    if (route.params?.food && route.params?.meal && route.params?.date) {
      const foodDate = new Date(route.params.date);
      handleAddFood(route.params.food, route.params.meal, foodDate);
      navigation.setParams({ food: null, meal: null, date: null });
    }
  }, [route.params?.food, route.params?.meal, route.params?.date, handleAddFood, navigation]);

  const toggleMealVisibility = (meal) => {
    setSelectedMeal(meal);
  };

  const calculateTotalCalories = (foods) => {
    return foods.reduce((total, food) => total + Number(food.calories), 0);
  };

  const handleSwipeableOpen = (item, meal) => {
    handleDeleteFood(item.id, meal, selectedDate);
  };

  const selectedFoods = selectedMeal === 'breakfast' ? breakfastFoods : selectedMeal === 'lunch' ? lunchFoods : dinnerFoods;
  const filteredFoods = selectedFoods.filter(food => new Date(food.date).toDateString() === selectedDate.toDateString());
  const totalCalories = calculateTotalCalories(filteredFoods);

  const handlePreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handleFoodSelect = useCallback((item, meal) => {
    const foodDetails = {
      ...item,
      product_name: item.name,
      image: item.image,
      nutriments: {
        'energy-kcal_100g': item.calories,
        'carbohydrates_100g': item.carbs,
        'fat_100g': item.fat,
        'proteins_100g': item.protein,
      },
      date: selectedDate.toISOString()
    };
  
    navigation.navigate('FoodDetail', { 
      food: foodDetails, 
      meal, 
      date: selectedDate.toISOString(), 
      update: true, 
      foodId: item.id 
    });
  }, [navigation, selectedDate]);

  return (
    <ApplicationCustomScreen
      headerLeft={<Ionicons name="person-circle-outline" size={28} color="#fdf5ec" />}
      headerRight={<Ionicons name="settings-outline" size={28} color="#fdf5ec" />}
      onProfilePress={handleProfilePress}
      onSettingsPress={handleSettingsPress}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Nutrition Dashboard</Text>
          <View style={styles.dateNavigation}>
            <TouchableOpacity onPress={handlePreviousDay}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#fdf5ec" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
            <TouchableOpacity onPress={handleNextDay}>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#fdf5ec" />
            </TouchableOpacity>
          </View>
          <ProgressBar value={dailyNutrition.calories} maxValue={targetCalories} customText={"Calories"} />

          <View style={styles.circularProgressContainer}>
            <CircularProgress title="Protein" value={dailyNutrition.protein.toFixed(0)} maxValue={targetProtein} size={60} strokeWidth={6} color="#29335c" duration={1500} />
            <CircularProgress title="Carbs" value={dailyNutrition.carbs.toFixed(0)} maxValue={targetCarbs} size={60} strokeWidth={6} color="#db2b39" duration={1500} />
            <CircularProgress title="Fat" value={dailyNutrition.fat.toFixed(0)} maxValue={targetFats} size={60} strokeWidth={6} color="#20a39e" duration={1500} />
          </View>

          <View style={styles.mealSelector}>
            <TouchableOpacity
              onPress={() => toggleMealVisibility('breakfast')}
              style={[styles.mealButton, selectedMeal === 'breakfast' && styles.selectedMealButton]}
            >
              <Text style={styles.mealButtonText}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleMealVisibility('lunch')}
              style={[styles.mealButton, selectedMeal === 'lunch' && styles.selectedMealButton]}
            >
              <Text style={styles.mealButtonText}>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleMealVisibility('dinner')}
              style={[styles.mealButton, selectedMeal === 'dinner' && styles.selectedMealButton]}
            >
              <Text style={styles.mealButtonText}>Dinner</Text>
            </TouchableOpacity>
          </View>

          {selectedMeal === 'breakfast' && (
            <MealContainer
              meal="breakfast"
              foods={filteredFoods}
              onSwipeableOpen={handleSwipeableOpen}
              onPress={(item) => handleFoodSelect(item, 'breakfast')}
              mealContainer={styles.mealContainer}
              mealTitle={styles.mealTitle}
              mealScrollView={styles.mealScrollView}
              foodImage={styles.foodImage}
              foodName={styles.foodName}
              foodCalories={styles.foodCalories}
              foodNutrient={styles.foodNutrient}
              isFoodDeletable={true}
              displayMealName={true}
            />
          )}
          {selectedMeal === 'lunch' && (
            <MealContainer
              meal="lunch"
              foods={filteredFoods}
              onSwipeableOpen={handleSwipeableOpen}
              onPress={(item) => handleFoodSelect(item, 'lunch')}
              mealContainer={styles.mealContainer}
              mealTitle={styles.mealTitle}
              mealScrollView={styles.mealScrollView}
              foodImage={styles.foodImage}
              foodName={styles.foodName}
              foodCalories={styles.foodCalories}
              foodNutrient={styles.foodNutrient}
              isFoodDeletable={true}
              displayMealName={true}
            />
          )}
          {selectedMeal === 'dinner' && (
            <MealContainer
              meal="dinner"
              foods={filteredFoods}
              onSwipeableOpen={handleSwipeableOpen}
              onPress={(item) => handleFoodSelect(item, 'dinner')}
              mealContainer={styles.mealContainer}
              mealTitle={styles.mealTitle}
              mealScrollView={styles.mealScrollView}
              foodImage={styles.foodImage}
              foodName={styles.foodName}
              foodCalories={styles.foodCalories}
              foodNutrient={styles.foodNutrient}
              isFoodDeletable={true}
              displayMealName={true}
            />
          )}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('FoodSelection', { meal: selectedMeal, date: selectedDate.toISOString() })}>
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
            {filteredFoods.length > 0 && (
              <Text style={styles.totalCaloriesText}>{`Total: ${totalCalories} Calories`}</Text>
            )}
          </View>
        </View>
      </View>
    </ApplicationCustomScreen>
  );
};

export default NutritionScreen;
