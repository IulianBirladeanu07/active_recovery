// CustomButton.js
import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';

const CustomButton = ({ icon, label, onPress, isActive }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const endAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive && styles.activeButton,
        { transform: [{ scale: scaleValue }] },
      ]}
      onPress={onPress}
      onPressIn={startAnimation}
      onPressOut={endAnimation}
    >
      {icon}
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#02111B',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
  },
  activeButton: {
    backgroundColor: '#e71d27',
  },
});

export default CustomButton;
