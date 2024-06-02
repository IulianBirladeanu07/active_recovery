import React from 'react';
import { View, Text, FlatList } from 'react-native';
import FoodItem from './FoodItem';

const MealContainer = ({ 
  meal, 
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
  isFoodDeletable, // New prop
  displayMealName // New prop
}) => (
  <View style={mealContainer}>
    {displayMealName && <Text style={mealTitle}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>}
    <FlatList
      data={foods}
      renderItem={({ item }) => (
        <FoodItem 
          item={item}
          meal={meal} 
          onSwipeableOpen={onSwipeableOpen}
          onPress={() => onPress(item, meal)} 
          foodName={foodName}
          foodCalories={foodCalories}
          foodNutrient={foodNutrient}
          foodImage={foodImage}
          isFoodDeletable={isFoodDeletable} // Pass the prop to FoodItem
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      style={mealScrollView}
    />
  </View>
);

export default MealContainer;
