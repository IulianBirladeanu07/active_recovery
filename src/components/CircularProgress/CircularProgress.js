import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedProps, withTiming } from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
  value,
  maxValue,
  size = 100,
  strokeWidth = 10,
  color = "#FF7043",
  trailColor = "#ffffff",
  duration = 1400,
  measure = "KCAL", // Default measure
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;

  // Determine if calories are overconsumed
  const isOverconsumed = value > maxValue;
  const absoluteValue = isOverconsumed ? value - maxValue : maxValue - value;

  // Calculate the display value and text
  const displayValue = absoluteValue.toFixed(0);
  const displayText = isOverconsumed ? `${measure} OVER` : `${measure} LEFT`;

  // Calculate the percentage of progress or overconsumption
  const consumedPercentage = isOverconsumed
    ? 100
    : Math.min((value / maxValue) * 100, 100);

  // Calculate the strokeDashoffset
  const strokeDashoffset = (1 - consumedPercentage / 100) * circumference;

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(strokeDashoffset, { duration }),
    stroke: color,
  }));

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
        <Text
          style={[
            styles.text,
            {
              fontSize: size / 5,
            },
          ]}
        >
          {displayValue}
        </Text>
        <Text style={styles.unitText}>{displayText}</Text>
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
