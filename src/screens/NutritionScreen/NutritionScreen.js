import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
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
import debounce from 'lodash/debounce';

const NutritionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userSettings } = useContext(WorkoutContext);
  const { breakfastFoods, lunchFoods, dinnerFoods, handleDeleteMeal, fetchMeals } = useFoodContext();
  
  const [selectedDate, setSelectedDate] = useState(new Date(route.params?.date || new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  // Debounce fetchMeals to avoid excessive calls
  const debounceFetchMeals = useCallback(debounce(fetchMeals, 300), [fetchMeals]);

  // Fetch meals when the screen loads
  useEffect(() => {
    debounceFetchMeals(selectedDate);  // Fetch meals for the selected date
  }, [debounceFetchMeals, selectedDate]);

  // Trigger fetching meals if 'refresh' parameter is true
  useEffect(() => {
    if (route.params?.refresh) {
      debounceFetchMeals(selectedDate);
      // Clear the refresh parameter after fetching
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh, debounceFetchMeals, navigation, selectedDate]);

  // Handle date changes and fetch meals for the new date
  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  // Calculate total calories for all meals on the selected date
  const totalCalories = useMemo(() => {
    return [...breakfastFoods, ...lunchFoods, ...dinnerFoods].reduce((total, meal) => total + Number(meal.calories), 0);
  }, [breakfastFoods, lunchFoods, dinnerFoods]);

  // Calculate kcal left
  const kcalLeft = Math.max(0, targetCalories - totalCalories);
  // Filter meals based on the selected date and selected meal type
  const filteredMeals = useMemo(() => {
    return [...breakfastFoods, ...lunchFoods, ...dinnerFoods].filter(meal => 
      new Date(meal.timestamp).toDateString() === selectedDate.toDateString() &&
      meal.mealType === selectedMeal
    );
  }, [breakfastFoods, lunchFoods, dinnerFoods, selectedDate, selectedMeal]);

  const dailyNutrition = useDailyNutrition(breakfastFoods, lunchFoods, dinnerFoods, selectedDate);
  const { targetCalories, targetProtein, targetFats, targetCarbs } = userSettings;

  const remainingCalories = targetCalories - dailyNutrition.calories;
  const remainingCarbs = targetCarbs - dailyNutrition.carbs;
  const remainingProtein = targetProtein - dailyNutrition.protein
  const remainingFats = targetFats - dailyNutrition.fat
 
  const handleFoodSelect = (item) => {
    const foodDetails = {
      ...item,
      product_name: item.name,
      image: item.image,  // This should now correctly pass the image
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
      meal: selectedMeal, 
      date: selectedDate.toISOString(), 
      update: true, 
      foodId: item.id 
    });
  };

  const handleSwipeableOpen = useCallback((item) => {
    handleDeleteMeal(selectedMeal, item.id);
  }, [selectedMeal, handleDeleteMeal]);

  return (
    <ApplicationCustomScreen
      headerLeft={<Ionicons name="person-circle-outline" size={28} color="#fdf5ec" />}
      headerRight={<Ionicons name="settings-outline" size={28} color="#fdf5ec" />}
      onProfilePress={() => navigation.navigate('Profile')}
      onSettingsPress={() => navigation.navigate('Settings')}
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
              <CircularProgress title="Kcal Left" value={remainingCalories} maxValue={targetCalories} size={100} strokeWidth={10} color="#FFA726" duration={1500} />
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
              <ProgressBar value={remainingCarbs} maxValue={targetCarbs} customText="Carb" />
              <ProgressBar value={remainingProtein} maxValue={targetProtein} customText="Protein" />
              <ProgressBar value={remainingFats} maxValue={targetFats} customText="Fat" />
            </View>
          </View>

          <MealContainer
            foods={filteredMeals}
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
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
            {filteredMeals.length > 0 && (
              <Text style={styles.totalCaloriesText}>{`Total: ${totalCalories} Calories`}</Text>
            )}
          </View>
        </View>
      </View>
    </ApplicationCustomScreen>
  );
};

export default NutritionScreen;
