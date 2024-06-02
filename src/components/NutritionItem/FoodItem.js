import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const FoodItem = ({ item, meal, foodName, foodCalories, foodNutrient, foodImage, onSwipeableOpen, onPress, isFoodDeletable }) => {
  const renderRightActions = (progress, dragX) => {
    if (!isFoodDeletable) {
      return null;
    }

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
      </Animated.View>
    );
  };

  return (
    
    <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => onSwipeableOpen(item, meal)}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.foodItem}>
          <Image source={item.image} style={foodImage} />
          <View style={styles.foodDetails}>
            <Text style={foodName}>{item.name}</Text>
            <Text style={foodNutrient}>{item.quantity} {item.unit}</Text>
          </View>
          <Text style={foodCalories}>{item.calories}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'center',
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

export default FoodItem;
