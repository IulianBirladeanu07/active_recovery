import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
  // Filter foods based on the selected meal type
  const filteredFoods = foods.filter(food => food.mealType === selectedMeal);

  console.log('Selected meal:', selectedMeal); // Debugging line
  console.log('Filtered foods:', filteredFoods); // Debugging line

  return (
    <View style={[mealContainer, styles.paddingAdjustment]}>
      <View style={styles.mealSelector}>
        {['breakfast', 'lunch', 'dinner'].map(meal => (
          <TouchableOpacity
            key={meal}
            onPress={() => {
              console.log('Meal button pressed:', meal); // Debugging line
              setSelectedMeal(meal);
            }}
            style={styles.mealButton}
          >
            <Text style={[
              mealTitle, 
              selectedMeal === meal && styles.selectedMealTitle
            ]}>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.foodListContainer}>
        {filteredFoods.length > 0 ? (
          <FlatList
            data={filteredFoods}
            renderItem={({ item }) => (
              <FoodItem
                key={item.id} // Use a unique key
                item={item}
                meal={selectedMeal}
                onSwipeableOpen={onSwipeableOpen}
                onPress={() => onPress(item)}
                foodName={foodName}
                foodCalories={foodCalories}
                foodNutrient={foodNutrient}
                foodImage={foodImage}
                isFoodDeletable={isFoodDeletable}
              />
            )}
            keyExtractor={item => item.id} // Ensure the key is unique
            style={mealScrollView}
            showsVerticalScrollIndicator={false}
          />
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
  paddingAdjustment: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mealSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  mealButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectedMealTitle: {
    fontWeight: 'bold',
    color: '#FFA726',
  },
  foodListContainer: {
    flex: 1,
  },
  noFoodsText: {
    textAlign: 'center',
    color: '#ccc',
    paddingVertical: 20,
  },
});

export default MealContainer;
