import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
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
import { WorkoutContext } from '../../context/WorkoutContext';
import debounce from 'lodash/debounce';
import styles from './NutritionScreenStyles';

const NutritionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userSettings } = useContext(WorkoutContext);

  const {
    breakfastFoods,
    lunchFoods,
    dinnerFoods,
    handleDeleteMeal,
    fetchMeals,
    updateFoods,
    selectedDate,  // Use selectedDate from context
    setSelectedDate  // Use setSelectedDate from context
  } = useFoodContext();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMeals(selectedDate).catch(error => console.error('Failed to refetch meals:', error));
    });

    return unsubscribe;
  }, [navigation, selectedDate, fetchMeals]);

  useEffect(() => {
    if (!selectedDate || isNaN(new Date(selectedDate))) {
        console.warn('Invalid selectedDate');
        // tratează eroarea aici
    }
}, [selectedDate]);

  const debounceFetchMeals = useCallback(debounce(async (date) => {
    try {
      await fetchMeals(date);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  }, 100), [fetchMeals]);

  useEffect(() => {
    debounceFetchMeals(selectedDate);
  }, [debounceFetchMeals, selectedDate]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchMeals(selectedDate).catch(error => console.error('Failed to refresh meals:', error));
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh, fetchMeals, navigation, selectedDate]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const dailyNutrition = useDailyNutrition(breakfastFoods, lunchFoods, dinnerFoods);
  
  const { targetCalories, targetProtein, targetFats, targetCarbs } = userSettings;

  const remainingCalories = useMemo(() => targetCalories - dailyNutrition.calories, [targetCalories, dailyNutrition.calories]);
  const remainingCarbs = useMemo(() => targetCarbs - dailyNutrition.carbs, [targetCarbs, dailyNutrition.carbs]);
  const remainingProtein = useMemo(() => targetProtein - dailyNutrition.protein, [targetProtein, dailyNutrition.protein]);
  const remainingFats = useMemo(() => targetFats - dailyNutrition.fat, [targetFats, dailyNutrition.fat]);

  console.log(remainingProtein)


  const handleFoodSelect = (item) => {
    const foodDetails = {
      ...item,
      date: selectedDate.toISOString(),
      imageSource: item.image
    };

    navigation.navigate('FoodDetail', { 
      food: foodDetails, 
      meal: selectedMeal, 
      date: selectedDate.toISOString(), 
      update: true, 
      foodId: item.id,
      imageSource: item.image
    });
  };

  const handleSwipeableOpen = useCallback(async (item) => {
    console.log('Swiped open item:', item);

    const mealType = item.mealType;
    let updatedFoods;

    try {
      await handleDeleteMeal(mealType, item.id);

      switch (mealType) {
        case 'breakfast':
          updatedFoods = breakfastFoods.filter(food => food.id !== item.id);
          updateFoods('breakfast', updatedFoods);
          break;
        case 'lunch':
          updatedFoods = lunchFoods.filter(food => food.id !== item.id);
          updateFoods('lunch', updatedFoods);
          break;
        case 'dinner':
          updatedFoods = dinnerFoods.filter(food => food.id !== item.id);
          updateFoods('dinner', updatedFoods);
          break;
        default:
          console.error('Unknown meal type:', mealType);
          return;
      }

      console.log(`Updated ${mealType} foods list after swipe.`);
    } catch (error) {
      console.error('Failed to handle swipeable open:', error);
    }
  }, [breakfastFoods, lunchFoods, dinnerFoods, handleDeleteMeal, updateFoods]);

  const combinedFoods = useMemo(() => {
    switch (selectedMeal) {
      case 'breakfast':
        return breakfastFoods;
      case 'lunch':
        return lunchFoods;
      case 'dinner':
        return dinnerFoods;
      default:
        return [];
    }
  }, [selectedMeal, breakfastFoods, lunchFoods, dinnerFoods]);

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
                <CircularProgress 
                  title="Kcal Left" 
                  value={dailyNutrition.calories} 
                  maxValue={targetCalories} 
                  size={100} 
                  strokeWidth={10} 
                  color="#FFA726" 
                  duration={1500} 
                />
              <View style={styles.progressRow}>
                <View style={styles.innerProgressItem}>
                  <Ionicons name="restaurant-outline" size={18} color="#FFA726" />
                  <Text style={styles.innerProgressText}>{dailyNutrition.calories.toFixed(0)} Eaten</Text>
                </View>
                <View style={styles.innerProgressItem}>
                  <Ionicons name="flame-outline" size={18} color="#FF5722" />
                  <Text style={styles.innerProgressText}>{dailyNutrition.burnedCalories} Burned</Text>
                </View>
              </View>
            </View>

            <View style={styles.barContainer}>
            <ProgressBar
        value={dailyNutrition.carbs}
        maxValue={targetCarbs}
        customText="Carb"
        color="#4caf50" // Carb color
      />
      <ProgressBar
        value={dailyNutrition.protein}
        maxValue={targetProtein}
        customText="Protein"
        color="#9c27b0" // Protein color
      />
      <ProgressBar
        value={dailyNutrition.fat}
        maxValue={targetFats}
        customText="Fat"
        color="#2196f3" // Fat color
      />
            </View>
          </View>

          <MealContainer
            foods={combinedFoods}
            foodName={styles.foodName}
            foodCalories={styles.foodCalories}
            foodNutrient={styles.foodNutrient}
            foodImage={styles.foodImage}
            onSwipeableOpen={handleSwipeableOpen}
            onPress={handleFoodSelect}
            mealContainer={styles.mealContainer}
            mealTitle={styles.mealTitle}
            mealScrollView={styles.mealScrollView}
            isFoodDeletable={true}
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
          />

          <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => {
              const selectedDateString = selectedDate.toISOString(); // Convertim data într-un string ISO
              navigation.navigate('FoodSelection', { meal: selectedMeal, selectedDate: selectedDateString });
            }}
          >
            <Text style={styles.addButtonText}>Add Food</Text>
          </TouchableOpacity>

            <Text style={styles.totalCaloriesText}>{`Total: ${dailyNutrition.calories.toFixed(0)} Calories`}</Text>
          </View>
        </View>
      </View>
    </ApplicationCustomScreen>
  );
};

export default NutritionScreen;
