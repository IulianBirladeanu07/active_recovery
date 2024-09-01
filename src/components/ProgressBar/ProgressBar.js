import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ value, maxValue, customText }) => {
  const isOverconsumed = value > maxValue;
  const absoluteValue = isOverconsumed ? value - maxValue : maxValue - value;
  const consumedPercentage = isOverconsumed
    ? 100 // Fill the bar completely if overconsumed
    : Math.min((value / maxValue) * 100, 100); // Calculate percentage based on the value

  const fillWidth = `${consumedPercentage}%`;
  const barColor = isOverconsumed ? '#FF7043' : getColor(customText.toLowerCase());
  const displayText = isOverconsumed ? 'g over' : 'g left';

  return (
    <View style={styles.container}>
      <Text style={styles.customText}>{customText}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: fillWidth, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.label}>{`${absoluteValue.toFixed(0)} ${displayText}`}</Text>
    </View>
  );
};

function getColor(type) {
  switch (type) {
    case 'carb':
      return '#4caf50';
    case 'protein':
      return '#9c27b0';
    case 'fat':
      return '#2196f3';
    default:
      return '#3498db';
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1,
  },
  progressBarContainer: {
    position: 'relative',
    height: 8,
    width: '60%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 10,
    left: 0,
  },
  label: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  customText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
});

export default ProgressBar;
