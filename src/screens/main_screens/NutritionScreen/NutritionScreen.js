import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Animated, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import { useFoodContext } from '../../../../FoodContext';

const NutritionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { breakfastFoods, lunchFoods, dinnerFoods, handleAddFood } = useFoodContext();
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 200,
    protein: 100,
    carbs: 250,
    fat: 80,
  });

  const weightGoal = {
    currentWeight: 70,
    goalWeight: 65,
    dailyCalorieGoal: 1800,
  };

  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  useEffect(() => {
    if (route.params?.foodDetails && route.params?.meal) {
      handleAddFood(route.params.foodDetails, route.params.meal);
      // Clear the params to prevent infinite loop
      navigation.setParams({ foodDetails: null, meal: null });
    }
  }, [route.params?.foodDetails, route.params?.meal, handleAddFood, navigation]);

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
          <View style={styles.centerText}>
            {/* <Text style={styles.progressText}>{`${percentage.toFixed(2)}%`}</Text> */}
          </View>
        </View>
        <Text style={styles.values}>{`${value} / ${maxValue}`}</Text>
      </View>
    );
  };

  const toggleMealVisibility = (meal) => {
    setSelectedMeal(meal);
  };

  const renderMealContainer = (meal, foods) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealTitle}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
      <ScrollView style={styles.mealScrollView}>
        <View style={styles.foodContainer}>
          {foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Image source={food.image} style={styles.foodImage} />
              <View style={styles.foodDetails}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodNutrient}>Quantity: {food.quantity} {food.unit}</Text>
              </View>
              <Text style={styles.foodCalories}>{food.calories}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<MaterialCommunityIcons name="cog" size={28} color="#fdf5ec" />}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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

            <Button title="Add Food" onPress={() => navigation.navigate('FoodSelection', { meal: selectedMeal })} />
          </View>
        </ScrollView>
      </View>
    </ApplicationCustomScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  scrollContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 90,
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
  },
  selectedMealButton: {
    backgroundColor: '#008080',
  },
  mealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  mealScrollView: {
    maxHeight: 150, // Adjust this height as needed
    marginTop: 16,
  },
  mealContainer: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 20,
  },
  foodContainer: {
    backgroundColor: '#2c3e50',
    borderRadius: 15,
    overflow: 'hidden',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  foodImage: {
    width: 20,
    height: 20,
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
});

export default NutritionScreen;
