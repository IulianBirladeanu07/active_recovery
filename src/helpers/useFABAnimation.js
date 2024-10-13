import { useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const useFABAnimation = () => {
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const optionAnimations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  const handleFabPress = (isSearching) => {
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

  return {
    isFabExpanded,
    handleFabPress,
    animatedRotation,
    animatedSlideIn,
    animatedOpacity,
    optionTransforms,
  };
};

export default useFABAnimation;
