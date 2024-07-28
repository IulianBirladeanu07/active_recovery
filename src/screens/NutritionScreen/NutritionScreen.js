import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const dailyNutrition = useDailyNutrition(breakfastFoods, lunchFoods, dinnerFoods, selectedDate);
  const { targetCalories, targetProtein, targetFats, targetCarbs } = userSettings;

  useEffect(() => {
    if (route.params?.food && route.params?.meal && route.params?.date) {
      const foodDate = new Date(route.params.date);
      handleAddFood(route.params.food, route.params.meal, foodDate);
      navigation.setParams({ food: null, meal: null, date: null });
    }
  }, [route.params?.food, route.params?.meal, route.params?.date, handleAddFood, navigation]);

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const calculateTotalCalories = (foods) => {
    return foods.reduce((total, food) => total + Number(food.calories), 0);
  };

  const handleSwipeableOpen = (item, meal) => {
    handleDeleteFood(item.id, meal, selectedDate);
  };

  const selectedFoods = {
    breakfast: breakfastFoods.filter(food => new Date(food.date).toDateString() === selectedDate.toDateString()),
    lunch: lunchFoods.filter(food => new Date(food.date).toDateString() === selectedDate.toDateString()),
    dinner: dinnerFoods.filter(food => new Date(food.date).toDateString() === selectedDate.toDateString()),
  };

  const totalCalories = calculateTotalCalories(selectedFoods[selectedMeal]);
  const remainingCalories = targetCalories - totalCalories;
  console.log(remainingCalories)

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
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
          <View style={styles.dateNavigation}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <MaterialCommunityIcons name="calendar" size={28} color="#fdf5ec" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.statsContainer}>
            <View style={styles.circularProgressContainer}>
              <CircularProgress title="Calories" value={dailyNutrition.calories.toFixed(0)} maxValue={targetCalories} size={100} strokeWidth={10} color="#FFA726" duration={1500} />
              <View style={styles.progressRow}>
                <View style={styles.innerProgressItem}>
                  <Ionicons name="restaurant-outline" size={18} color="#FFA726" />
                  <Text style={styles.innerProgressText}>{totalCalories} Eaten</Text>
                </View>
                <View style={styles.innerProgressItem}>
                  <Ionicons name="flame-outline" size={18} color="#FF5722" />
                  <Text style={styles.innerProgressText}>{dailyNutrition.burnedCalories} Burned</Text>
                </View>
              </View>
            </View>

            <View style={styles.barContainer}>
              <ProgressBar value={dailyNutrition.carbs} maxValue={targetCarbs} customText="Carb" />
              <ProgressBar value={dailyNutrition.protein} maxValue={targetProtein} customText="Protein" />
              <ProgressBar value={dailyNutrition.fat} maxValue={targetFats} customText="Fat" />
            </View>
          </View>

          <MealContainer
            foods={selectedFoods}
            onSwipeableOpen={handleSwipeableOpen}
            onPress={handleFoodSelect}
            mealContainer={styles.mealContainer}
            mealTitle={styles.mealTitle}
            mealScrollView={styles.mealScrollView}
            foodName={styles.foodName}
            foodCalories={styles.foodCalories}
            foodNutrient={styles.foodNutrient}
            foodImage={styles.foodImage}
            isFoodDeletable={true}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('FoodSelection', { meal: selectedMeal, date: selectedDate.toISOString() })}>
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
            {selectedFoods[selectedMeal].length > 0 && (
              <Text style={styles.totalCaloriesText}>{`Total: ${totalCalories} Calories`}</Text>
            )}
          </View>
        </View>
      </View>
    </ApplicationCustomScreen>
  );
};

export default NutritionScreen;
