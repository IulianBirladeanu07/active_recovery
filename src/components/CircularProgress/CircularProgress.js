  import React, { useEffect } from "react";
  import { View, StyleSheet, Text } from "react-native";
  import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
  import { Circle, Svg } from "react-native-svg";

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedText = Animated.createAnimatedComponent(Text);

  const CircularProgress = ({ title, value, maxValue, size = 100, strokeWidth = 10, color = "#FF7043", trailColor = "#ffffff", duration = 1400 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI * 2;

    const strokeOffset = useSharedValue(0);

    // Calculate the remaining value for display purposes
    const remainingValue = (maxValue - value).toFixed(0);

    // Calculate the percentage of calories consumed
    const consumedPercentage = Math.min((value / maxValue) * 100, 100);

    const animatedCircleProps = useAnimatedProps(() => {
      return {
        strokeDashoffset: withTiming((consumedPercentage / 100) * circumference, { duration }),
        stroke: color,
      };
    });

    useEffect(() => {
      strokeOffset.value = (consumedPercentage / 100) * circumference;
    }, [value, maxValue, consumedPercentage, circumference, strokeOffset]);

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
            {value}
          </Text>
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
