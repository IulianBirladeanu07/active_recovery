import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { getFoodImage, categoryImageMap } from '../../services/foodImageService';

const FoodItem = ({ item, meal, foodName, foodCalories, foodNutrient, foodImage, onSwipeableOpen, onPress, isFoodDeletable }) => {
  // Get the image source using the utility function
  const imageSource = item.image || getFoodImage(item.Nume_Produs, 'default', categoryImageMap);

  // Direct use of item.Calorii assuming it's the total for the item
  const calories = Math.round(item.Calorii);

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Swipeable actions
  const renderRightActions = (progress, dragX) => {
    if (!isFoodDeletable) return null;

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
        <TouchableOpacity onPress={() => onSwipeableOpen(item, meal)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => onSwipeableOpen(item, meal)}>
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.foodItem}>
          <Image source={imageSource} style={foodImage} resizeMode="contain" />
          <View style={styles.foodDetails}>
            <Text style={foodName} numberOfLines={1} ellipsizeMode="tail">
              {truncateText(item.Nume_Produs, 15)} {/* Adjust max length as necessary */}
            </Text>
            <Text style={foodNutrient}>{item.quantity} {item.unit}</Text>
          </View>
          <Text style={foodCalories}>{calories} kcal</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
  foodImage: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
});

export default FoodItem;
