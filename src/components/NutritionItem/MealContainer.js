import React from 'react';
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
  isFoodDeletable,
  selectedMeal,
  setSelectedMeal,
}) => {
  // Filter the foods based on the selectedMeal type
  const filteredFoods = foods.filter(food => food.mealType === selectedMeal);

  const renderMealTitle = (meal) => (
    <TouchableOpacity 
      onPress={() => setSelectedMeal(meal)} 
      style={{ paddingHorizontal: 10, paddingVertical: 5 }}
    >
      <Text style={[mealTitle, selectedMeal === meal && { fontWeight: 'bold', color: '#FFA726' }]}>
        {meal.charAt(0).toUpperCase() + meal.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={mealContainer}>
      {/* Meal selection */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        {renderMealTitle('breakfast')}
        {renderMealTitle('lunch')}
        {renderMealTitle('dinner')}
      </View>

      {/* Food items or No foods message */}
      {filteredFoods.length > 0 ? (
        <FlatList
          data={filteredFoods}
          renderItem={({ item, index }) => (
            <FoodItem
              key={`${item.id}_${index}`} // Unique key combining id and index
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
          )}
          keyExtractor={(item, index) => `${item.id}_${index}`} // Ensure unique keys
          style={mealScrollView}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={{ textAlign: 'center', color: '#ccc', paddingVertical: 20 }}>
          No foods added for {selectedMeal}
        </Text>
      )}
    </View>
  );
};

export default MealContainer;
