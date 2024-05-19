import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FoodItem from './FoodItem';
const MealContainer = ({ meal, foods, onSwipeableOpen, onPress }) => (
  <View style={styles.mealContainer}>
    <Text style={styles.mealTitle}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
    <FlatList
      data={foods}
      renderItem={({ item }) => (
        <FoodItem item={item} meal={meal} onSwipeableOpen={onSwipeableOpen} onPress={() => onPress(item, meal)} />
      )}
      keyExtractor={(item, index) => index.toString()}
      style={styles.mealScrollView}
    />
  </View>
);

const styles = StyleSheet.create({
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
  mealScrollView: {
    height: 150, // Fixed height to make the content scrollable within
  },
});

export default MealContainer;
