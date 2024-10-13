import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../screens/FoodSelectionScreen/FoodSelectionScreenStyle'

const FabMenu = ({ isSearching, navigation }) => {
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const optionAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const animatedRotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const animatedSlideIn = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const optionTransforms = optionAnimations.map(anim => ({
    opacity: anim,
    transform: [{
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
      }),
    }],
  }));

  const handleFabPress = () => {
    if (isSearching) {
      setIsFabExpanded(false);
      return;
    }
    setIsFabExpanded(!isFabExpanded);
    Animated.parallel([
      Animated.timing(animation, {
        toValue: isFabExpanded ? 0 : 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: isFabExpanded ? 1 : 1.1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rotationValue, {
        toValue: isFabExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!isFabExpanded) {
        animateOptions();
      }
    });
  };

  const animateOptions = () => {
    const delay = isFabExpanded ? 0 : 100;
    Animated.stagger(delay, optionAnimations.map(anim => 
      Animated.timing(anim, {
        toValue: isFabExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    )).start();
  };

  const handleOptionPress = (option) => {
    switch (option) {
      case 'Add New Food without barcode':
        navigation.navigate('AddProducts', { type: 'foodWithoutBarcode' });
        break;
      case 'Add New Food with barcode':
        navigation.navigate('AddProducts', { type: 'foodWithBarcode' });
        break;
      case 'Add New Meals':
        navigation.navigate('AddProducts', { type: 'meals' });
        break;
      case 'Add Calories':
        navigation.navigate('AddProducts', { type: 'calories' });
        break;
      default:
        break;
    }
    setIsFabExpanded(false);
  };

  useEffect(() => {
    if (!isFabExpanded) {
      Animated.parallel(optionAnimations.map(anim => 
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      )).start();
    }
  }, [isFabExpanded]);

  if (isSearching) return null;

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Animated.View style={{ transform: [{ rotate: animatedRotation }, { scale: scaleValue }] }}>
          <MaterialCommunityIcons name="note-edit" size={30} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

      {isFabExpanded && (
        <Animated.View
          style={[
            styles.optionsContainer,
            { opacity: animatedOpacity, transform: [{ translateY: animatedSlideIn }] }
          ]}
        >
          <View style={styles.optionsInnerContainer}>
            {['Add New Food without barcode', 'Add New Food with barcode', 'Add New Meals', 'Add Calories'].map((option, index) => (
              <Animated.View key={index} style={optionTransforms[index]}>
                <TouchableOpacity style={styles.option} onPress={() => handleOptionPress(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default FabMenu;