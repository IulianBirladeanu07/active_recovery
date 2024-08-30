import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import FoodItem from './FoodItem';

const MealContainer = ({
  foods,
  foodName,
  foodCalories,
  foodNutrient,
  foodImage,
  onSwipeableOpen,
  onPress,
  mealContainer,
  mealTitle,
  mealScrollView,
  isFoodDeletable,
  selectedMeal,
  setSelectedMeal,
}) => {
  const filteredFoods = foods.filter(food => food.mealType === selectedMeal);

  return (
    <View style={[mealContainer, styles.container]}>
      <View style={styles.mealButtonsContainer}>
        {['breakfast', 'lunch', 'dinner'].map(meal => (
          <TouchableOpacity 
            key={meal} 
            onPress={() => setSelectedMeal(meal)} 
            style={styles.mealButton}
          >
            <Text style={[mealTitle, selectedMeal === meal && styles.selectedMealText]}>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.listContainer}>
        {filteredFoods.length > 0 ? (
          <ScrollView contentContainerStyle={mealScrollView}>
            {filteredFoods.map((item, index) => (
              <FoodItem
                key={`${item.Nume_Produs}_${index}`}
                item={item}
                meal={selectedMeal}
                onSwipeableOpen={onSwipeableOpen}
                onPress={() => onPress(item, selectedMeal)}
                foodName={foodName}
                foodCalories={foodCalories}
                foodNutrient={foodNutrient}
                foodImage={foodImage}
                isFoodDeletable={isFoodDeletable}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noFoodsText}>
            No foods added for {selectedMeal}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#02202B',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    height: 250, // Fixed height
  },
  mealButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  mealButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectedMealText: {
    fontWeight: 'bold',
    color: '#FFA726',
  },
  listContainer: {
    flex: 1, // Ensure it takes up available space
  },
  noFoodsText: {
    textAlign: 'center',
    color: '#ccc',
    paddingVertical: 20,
  },
});

export default MealContainer;
