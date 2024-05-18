import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import { useFoodContext } from '../../../../FoodContext';

const NutritionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { breakfastFoods, lunchFoods, dinnerFoods, handleAddFood, handleDeleteFood } = useFoodContext();
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const weightGoal = {
    currentWeight: 70,
    goalWeight: 65,
    dailyCalorieGoal: 1800,
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  useEffect(() => {
    if (route.params?.foodDetails && route.params?.meal) {
      handleAddFood(route.params.foodDetails, route.params.meal);
      navigation.setParams({ foodDetails: null, meal: null });
    }
  }, [route.params?.foodDetails, route.params?.meal, handleAddFood, navigation]);

  useEffect(() => {
    const totalNutrition = calculateTotalNutrition();
    setDailyNutrition(totalNutrition);
  }, [breakfastFoods, lunchFoods, dinnerFoods]);

  const calculateTotalNutrition = () => {
    const allFoods = [...breakfastFoods, ...lunchFoods, ...dinnerFoods];
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

  const ProgressBar = ({ value, maxValue }) => {
    const percentage = (value / maxValue) * 100;
    const fillWidth = `${percentage}%`;
    const barColor = getColor(percentage);

    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: fillWidth, backgroundColor: barColor }]} />
        <Text style={styles.progressBarText}>
          {`${value.toFixed(2)} / ${maxValue} Calories (${percentage.toFixed(2)}%)`}
        </Text>
      </View>
    );
  };

  function getColor(percentage) {
    if (percentage < 15) return '#e74c3c';
    if (percentage < 60) return '#3498db';
    return '#2ecc71';
  }

  const CircularProgress = ({ title, value, maxValue, size = 100, strokeWidth = 10, color }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const halfSize = size / 2;
    const radius = halfSize - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = (value / maxValue) * 100;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, [percentage]);

    const strokeDashoffset = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
    });

    return (
      <View style={styles.circularContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: size, height: size }}>
          <View
            style={[
              styles.circle,
              {
                width: size,
                height: size,
                borderRadius: halfSize,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
              },
            ]}
          />
          <Animated.View
            style={[
              styles.animatedCircle,
              {
                width: size,
                height: size,
                borderRadius: halfSize,
                borderWidth: strokeWidth,
                borderColor: color,
                position: 'absolute',
                transform: [{ rotate: '-90deg' }],
                strokeDasharray: `${circumference} ${circumference}`,
                strokeDashoffset,
              },
            ]}
          />
          <View style={styles.centerText} />
        </View>
        <Text style={styles.values}>{`${value} / ${maxValue}`}</Text>
      </View>
    );
  };

  const toggleMealVisibility = (meal) => {
    setSelectedMeal(meal);
  };

  const calculateTotalCalories = (foods) => {
    return foods.reduce((total, food) => total + Number(food.calories), 0);
  };

  const handleSwipeableOpen = (item, meal) => {
    const deleteAnim = new Animated.Value(1);
    Animated.timing(deleteAnim, {
      toValue: 0,
      duration: 75, // Reduced duration for faster animation
      useNativeDriver: true,
    }).start(() => handleDeleteFood(item.id, meal));
  };

  const renderRightActions = (progress, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [-100, 0],
      extrapolate: 'clamp',
    });

    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteButtonContainer, { opacity, transform: [{ translateX }, { scale }] }]}>
        <View style={styles.deleteButton}></View>
      </Animated.View>
    );
  };

  const renderMealContainer = (meal, foods) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealTitle}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
      <FlatList
        data={foods}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX)}
            onSwipeableOpen={() => handleSwipeableOpen(item, meal)}
          >
            <TouchableOpacity onPress={() => navigation.navigate('FoodDetail', { food: item, meal })}>
              <View style={styles.foodItem}>
                <Image source={item.image} style={styles.foodImage} />
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodNutrient}>{item.quantity} {item.unit}</Text>
                </View>
                <Text style={styles.foodCalories}>{item.calories}</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.mealScrollView}
      />
    </View>
  );

  const selectedFoods = selectedMeal === 'breakfast' ? breakfastFoods : selectedMeal === 'lunch' ? lunchFoods : dinnerFoods;
  const totalCalories = calculateTotalCalories(selectedFoods);

  return (
    <ApplicationCustomScreen
      title="Dashboard"
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<MaterialCommunityIcons name="cog" size={28} color="#fdf5ec" />}
      onProfilePress={navigateToSettings}
      onSettingsPress={navigateToSettings}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Nutrition Dashboard</Text>
          <ProgressBar value={dailyNutrition.calories} maxValue={weightGoal.dailyCalorieGoal} />

          <View style={styles.circularProgressContainer}>
            <CircularProgress title="Protein" value={dailyNutrition.protein} maxValue={150} size={30} strokeWidth={3} color='#3498db' />
            <CircularProgress title="Carbs" value={dailyNutrition.carbs} maxValue={300} size={30} strokeWidth={3} color='#e74c3c' />
            <CircularProgress title="Fat" value={dailyNutrition.fat} maxValue={100} size={30} strokeWidth={3} color='#2ecc71' />
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

          {selectedMeal === 'breakfast' && renderMealContainer('breakfast', breakfastFoods)}
          {selectedMeal === 'lunch' && renderMealContainer('lunch', lunchFoods)}
          {selectedMeal === 'dinner' && renderMealContainer('dinner', dinnerFoods)}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('FoodSelection', { meal: selectedMeal })}>
              <Text style={styles.addButtonText}>Add Food</Text>
            </TouchableOpacity>
            {selectedFoods.length > 0 && (
              <Text style={styles.totalCaloriesText}>{`Total: ${totalCalories} Calories`}</Text>
            )}
          </View>
        </View>
      </View>
    </ApplicationCustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#02111B',
  },
  scrollContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 170,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  progressBarContainer: {
    position: 'relative',
    height: 29,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 7,
  },
  progressBarText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  circularProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 325,
    marginTop: 20,
    marginBottom: 20,
  },
  circularContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  animatedCircle: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  values: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mealSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#005050',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  selectedMealButton: {
    backgroundColor: '#008080',
  },
  mealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },  
  mealScrollView: {
    height: 150, // Fixed height to make the content scrollable within
  },
  mealContainer: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#02202B',
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 5,
    left: 10,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  foodImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  foodNutrient: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  addButton: {
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    left: 5,
  },
  totalCaloriesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    backgroundColor: '#ff3b30',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    height: '100%',
    width: 80,
  },
});

export default NutritionScreen;
