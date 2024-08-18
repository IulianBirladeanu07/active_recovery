import React, { useContext, useState, useCallback, useEffect } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApplicationCustomScreen from '../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import CustomButton from '../../components/CustomButton/CustomButton';
import BarGraph from '../../components/BarGraph/BarGraph';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import MealContainer from '../../components/NutritionItem/MealContainer';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import { useFoodContext } from '../../context/FoodContext';
import { AuthContext } from '../../context/AuthContext';
import useDailyNutrition from '../../helpers/useDailyNutrtion';
import styles from './HomeScreenStyles';
import { WorkoutContext } from '../../context/WorkoutContext';

const HomeScreen = () => {
  const { breakfastFoods = [], lunchFoods = [], dinnerFoods = [], fetchWeeklyCalorieData } = useFoodContext();
  const { workoutsThisWeek = 0, lastWorkout = null, userSettings = {} } = useContext(WorkoutContext);
  const { targetCalories = 2000 } = userSettings; // Default to 2000 if not provided
  const [selectedMeal, setSelectedMeal] = useState('breakfast'); // Default to breakfast
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyCalories, setDailyCalories] = useState([]);
  
  const navigation = useNavigation();
  const route = useRoute();

  const dailyNutrition = useDailyNutrition(breakfastFoods, lunchFoods, dinnerFoods, selectedDate); // Use the custom hook

  const fetchAndSetCalories = async () => {
    try {
      const caloriesData = await fetchWeeklyCalorieData(); // Assuming this function returns a promise
      setDailyCalories(caloriesData || []); // Ensure caloriesData is an array or an empty array
    } catch (error) {
      console.error('Failed to fetch calories data:', error);
      setDailyCalories([]); // Set to an empty array in case of an error
    }
  };

  useEffect(() => {
    fetchAndSetCalories();
  }, [selectedDate]); // Ensure selectedDate is included in your component's props if it affects data fetching

  useFocusEffect(
    useCallback(() => {
      fetchAndSetCalories(); // Fetch data when the screen is focused
    }, [])
  );

  const handleLastWorkout = () => {
    const formattedWorkoutData = {
      note: lastWorkout?.note || '',
      exercises: lastWorkout?.exercises?.map(exercise => ({
        exerciseName: exercise.exerciseName,
        sets: exercise.sets
      })) || [],
    };

    navigation.navigate('StartWorkout', { selectedWorkout: formattedWorkoutData });
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleWorkoutPress = () => {
    navigation.navigate('Workout');
  };

  const handleNutritionPress = () => {
    navigation.navigate('Nutrition');
  };

  const handleProgressPress = () => {
    navigation.navigate('Progress');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const isButtonActive = (screenName) => {
    return route.name === screenName;
  };

  // const getMealFoods = () => {
  //   const today = selectedDate.toISOString().split('T')[0]; // Format date to yyyy-mm-dd

  //   const filterFoodsByDate = (foods) => {
  //     if (!foods) return [];
  //     return foods.filter(food => {
  //       const foodDate = new Date(food.date).toISOString().split('T')[0]; // Convert food date to yyyy-mm-dd
  //       return foodDate === today;
  //     });
  //   };

  //   switch (selectedMeal) {
  //     case 'breakfast':
  //       return filterFoodsByDate(breakfastFoods);
  //     case 'lunch':
  //       return filterFoodsByDate(lunchFoods);
  //     case 'dinner':
  //       return filterFoodsByDate(dinnerFoods);
  //     default:
  //       return [];
  //   }
  // };

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
      date: selectedDate.toISOString() // Convert date to string
    };

    navigation.navigate('FoodDetail', { 
      food: foodDetails, 
      meal, 
      date: selectedDate.toISOString(), // Ensure date is passed as a string
      update: true, 
      foodId: item.id 
    });
  }, [navigation, selectedDate]);

  const mealOptions = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
  ];

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    setDropdownVisible(false);
  };

  return (
    <ApplicationCustomScreen
      headerLeft={<Ionicons name="person-circle-outline" size={28} color="#fdf5ec" />}
      headerRight={<Ionicons name="settings-outline" size={28} color="#fdf5ec" />}
      onProfilePress={handleProfilePress}
      onSettingsPress={handleSettingsPress}
    >
      <FlatList
        contentContainerStyle={styles.container}
        data={[{ key: 'content' }]}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.headerText}>Home Dashboard</Text>
            <ProgressBar value={dailyNutrition.calories} maxValue={targetCalories} customText={"Calories"} />

            <View style={styles.recentActivityContainer}>
              <View style={styles.recentWorkoutContainer}>
                <Text style={styles.lastWorkoutText}>   Most Recent Workout</Text>
                {lastWorkout ? (
                  <ScrollView
                    style={styles.lastWorkoutScroll}
                    contentContainerStyle={styles.lastWorkoutContent}
                    nestedScrollEnabled={true}
                  >
                    <TouchableOpacity onPress={handleLastWorkout}>
                      {lastWorkout.exercises && lastWorkout.exercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseContainer}>
                          <View style={styles.exerciseHeader}>
                            <Ionicons name="barbell-outline" size={20} color="#008080" />
                            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                          </View>
                          <View style={styles.bestSetContainer}>
                            <Text style={styles.bestSetText}>
                              {exercise.sets && exercise.sets.length > 0
                                ? `${exercise.sets[0].weight} kg x ${exercise.sets[0].reps} reps`
                                : 'N/A'}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </TouchableOpacity>
                  </ScrollView>
                ) : (
                  <View style={styles.noWorkoutsContainer}>
                    <Text style={styles.noWorkoutsText}>There are no previous workouts</Text>
                  </View>
                )}
              </View>
              <View style={styles.recentMealContainer}>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                  <Text style={styles.mealTitle}>{selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}</Text>
                </TouchableOpacity>
                <CustomDropdown
                  options={mealOptions}
                  selectedValue={selectedMeal}
                  onSelect={handleMealSelect}
                  isVisible={dropdownVisible}
                />
                {/* <MealContainer
                  meal={selectedMeal}
                  foods={getMealFoods()}
                  mealContainer={styles.mealContainer}
                  mealTitle={styles.mealTitle}
                  mealScrollView={styles.mealScrollView}
                  foodImage={styles.foodImage}
                  foodName={styles.foodName}
                  foodCalories={styles.foodCalories}
                  foodNutrient={styles.foodNutrient}
                  isFoodDeletable={false}
                  onPress={handleFoodSelect}
                /> */}
              </View>
            </View>

            <View style={styles.graphContainer}>
              <BarGraph
                dailyCalories={dailyCalories}
                targetCalories={targetCalories}
                colors={['#4caf50', '#2196f3', '#ffeb3b', '#ff9800', '#009688', '#673ab7', '#e91e63']}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                icon={<Ionicons name="home-outline" size={28} color="#fdf5ec" />}
                label="Dashboard"
                onPress={handleHomePress}
                isActive={isButtonActive('Home')}
              />
              <CustomButton
                icon={<Ionicons name="barbell-outline" size={28} color="#fdf5ec" />}
                label="Workout"
                onPress={handleWorkoutPress}
                isActive={isButtonActive('Workout')}
              />
              <CustomButton
                icon={<Ionicons name="restaurant-outline" size={28} color="#fdf5ec" />}
                label="Nutrition"
                onPress={handleNutritionPress}
                isActive={isButtonActive('Nutrition')}
              />
              <CustomButton
                icon={<Ionicons name="stats-chart-outline" size={28} color="#fdf5ec" />}
                label="Progress"
                onPress={handleProgressPress}
                isActive={isButtonActive('Progress')}
              />
            </View>
          </View>
        )}
      />
    </ApplicationCustomScreen>
  );
};

export default HomeScreen;
