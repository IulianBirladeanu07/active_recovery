import React, { useEffect } from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const CircularProgress = ({ title, value, maxValue, size = 100, strokeWidth = 10, color = "#FF7043", trailColor = "#ffffff", duration = 1400 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;

  const strokeOffset = useSharedValue(circumference);

  // Calculate the percentage for display purposes
  const displayValue = ((value / maxValue) * maxValue).toFixed(0);

  // Cap the percentage for animation to 100%
  const cappedPercentage = Math.min((value / maxValue) * 100, 100);

  const percentage = useDerivedValue(() => {
    return cappedPercentage;
  });

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(circumference - (cappedPercentage / 100) * circumference, { duration }),
      stroke: color,
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${displayValue}`,
    };
  });

  useEffect(() => {
    strokeOffset.value = circumference - (cappedPercentage / 100) * circumference;
  }, [value, maxValue, cappedPercentage, circumference, strokeOffset]);

  return (
    <View style={styles.container}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
      </Svg>
      <View style={styles.textContainer}>
        <AnimatedText
          style={[
            styles.text,
            {
              fontSize: size / 5,
            },
          ]}
          animatedProps={animatedTextProps}
          editable={false}
          underlineColorAndroid="transparent"
        />
        <Text style={styles.unitText}>KCAL LEFT</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  unitText: {
    fontSize: 10,
    color: "#BDBDBD",
    textAlign: "center",
    marginTop: 5,
  },
});

export default CircularProgress;
