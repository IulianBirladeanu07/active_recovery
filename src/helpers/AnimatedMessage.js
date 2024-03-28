import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

const AnimatedMessage = ({ message }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity is 0

  useEffect(() => {
    // Fade in the message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // After the message has faded in, wait for 2 seconds, then fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  }, [message]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim, // Bind opacity to animated value
        position: 'absolute',
        bottom: '10%', // Adjust positioning as needed
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: 'white' }}>{message}</Text>
    </Animated.View>
  );
};

export default AnimatedMessage;