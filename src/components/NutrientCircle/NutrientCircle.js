import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const NutrientCircle = ({ value, maxValue, size = 120, strokeWidth = 15 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / maxValue) * 100;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  const fillColor = getColor(percentage);

  function getColor(percentage) {
    if (percentage < 15) return '#e74c3c';
    if (percentage < 60) return '#3498db';
    return '#2ecc71';
  }

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: strokeDashoffset,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [strokeDashoffset]);

  const animatedRotation = animatedValue.interpolate({
    inputRange: [0, circumference],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: halfSize,
              borderWidth: strokeWidth,
              borderColor: fillColor,
              position: 'absolute',
            },
          ]}
        />
        <Animated.View
          style={[
            styles.animatedCircle,
            {
              width: size,
              height: size,
              borderRadius: halfSize,
              borderWidth: strokeWidth,
              borderColor: 'red',
              position: 'absolute',
              transform: [{ rotate: animatedRotation }],
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {`${value.toFixed(2)} / ${maxValue} Calories (${percentage.toFixed(2)}%)`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    position: 'absolute',
  },
  animatedCircle: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default NutrientCircle;
