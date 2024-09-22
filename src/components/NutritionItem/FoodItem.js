import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { getFoodImage, categoryImageMap } from '../../services/foodImageService';

const FoodItem = ({
  item,
  meal,
  foodName,
  foodCalories,
  foodNutrient,
  onSwipeableOpen,
  onPress,
  isFoodDeletable,
  onPlusPress,
  showPlusButton = false,
}) => {
  const imageSource = item.image || getFoodImage(item.Nume_Produs, 'default', categoryImageMap);
  const calories = Math.round(item.Calorii);

  // State to toggle between plus and checkmark
  const [isChecked, setIsChecked] = useState(false);

  // Animated values for the plus button
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const truncateText = (text, maxLength) => text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const handlePlusPress = (item) => {
    // Define animation for scaling, rotating, and fading
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(),
      Animated.timing(opacityAnim, {
        toValue: isChecked ? 1 : 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(),
      Animated.timing(rotateAnim, {
        toValue: isChecked ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start(),
    ]);

    // Toggle the checked state after animation
    setIsChecked(!isChecked);

    // Call the onPlusPress function
    onPlusPress(item)
  };

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
        <TouchableOpacity onPress={() => {
          console.log('Swiping open item:', item); // Debugging line
          onSwipeableOpen(item);
        }} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => {
      console.log('Swiped open item:', item); // Debugging line
      onSwipeableOpen(item);
    }}>
      <TouchableOpacity onPress={() => {
        console.log('Pressed item:', item); // Debugging line
        onPress(item);
      }} style={styles.touchableContainer}>
        <View style={styles.foodItem}>
          <Image source={imageSource} style={styles.foodImage} resizeMode="contain" />
          <View style={styles.foodDetails}>
            <Text style={foodName} numberOfLines={1} ellipsizeMode="tail">
              {truncateText(item.Nume_Produs, 20)}
            </Text>
            <Text style={foodNutrient}>{item.quantity} {item.unit}</Text>
          </View>
          <View style={styles.caloriesContainer}>
            <Text style={foodCalories}>{calories} kcal</Text>
            {showPlusButton && (
              <TouchableOpacity onPress={() => handlePlusPress(item)} style={styles.plusButton}>
                <Animated.View style={{
                  transform: [
                    { scale: scaleAnim },
                    { rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      }) 
                    }
                  ],
                  opacity: opacityAnim,
                }}>
                  <Ionicons name={isChecked ? "checkmark-circle-outline" : "add-circle-outline"} size={25} color={isChecked ? "#4CAF50" : "#FFA726"} />
                </Animated.View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    paddingVertical: 2,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginTop: 5,
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
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
    width: 35,
    height: 35,
    borderRadius: 5,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusButton: {
    marginLeft: 8,
  },
});

export default FoodItem;
