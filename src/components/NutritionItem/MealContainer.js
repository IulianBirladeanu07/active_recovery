import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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
  isFoodDeletable, // New prop
}) => {
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const toggleMealVisibility = (meal) => {
    setSelectedMeal(meal);
  };

  const renderMealTitle = (meal) => (
    <TouchableOpacity onPress={() => toggleMealVisibility(meal)}>
      <Text style={[mealTitle, selectedMeal === meal && { fontWeight: 'bold', color: '#FFA726' }]}>
        {meal.charAt(0).toUpperCase() + meal.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={mealContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        {renderMealTitle('breakfast')}
        {renderMealTitle('lunch')}
        {renderMealTitle('dinner')}
      </View>
      <FlatList
        data={foods[selectedMeal]}
        renderItem={({ item }) => (
          <FoodItem
            item={item}
            meal={selectedMeal}
            onSwipeableOpen={onSwipeableOpen}
            onPress={() => onPress(item, selectedMeal)}
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
};

export default MealContainer;
