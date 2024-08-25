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
  const filteredFoods = foods.filter(food => food.mealType === selectedMeal);

  return (
    <View style={[mealContainer, styles.paddingAdjustment]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        {['breakfast', 'lunch', 'dinner'].map(meal => (
          <TouchableOpacity key={meal} onPress={() => setSelectedMeal(meal)} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={[mealTitle, selectedMeal === meal && { fontWeight: 'bold', color: '#FFA726' }]}>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {filteredFoods.length > 0 ? (
          <FlatList
            data={filteredFoods}
            renderItem={({ item, index }) => (
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
            )}
            keyExtractor={(item, index) => `${item.Nume_Produs}_${index}`}
            style={mealScrollView}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={{ textAlign: 'center', color: '#ccc', paddingVertical: 20 }}>
            No foods added for {selectedMeal}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = {
  paddingAdjustment: {
    paddingHorizontal: 16, // Adjust these values as needed
    paddingVertical: 12,
  },
};

export default MealContainer;
