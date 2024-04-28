import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const ProgressBar = ({ progress }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false, // useNativeDriver: true is not supported for width animation
    }).start();
  }, [progress]);

  return (
    <View style={{ flexDirection: 'row', height: 20, backgroundColor: '#E0E0E0', borderRadius: 10, overflow: 'hidden' }}>
      <Animated.View style={{ width: `${animatedWidth * 100}%`, backgroundColor: '#008080', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} />
    </View>
  );
};

export default ProgressBar;