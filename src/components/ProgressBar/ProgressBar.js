import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({
  value,
  maxValue,
  customText,
  customColor = '#3498db',
  showLabel = true,
  unit = 'g', // Unit for measurement
}) => {
  const consumedPercentage = Math.min((value / maxValue) * 100, 100); // Calculate percentage based on the value
  const fillWidth = `${consumedPercentage}%`; // Fill width of the bar based on the percentage

  return (
    <View style={styles.container}>
      <Text style={styles.customText}>{customText}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: fillWidth, backgroundColor: customColor }]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {`${value.toFixed(0)} / ${maxValue.toFixed(0)} ${unit}`} {/* Display actualValue/goalValue format */}
        </Text>
      )}
    </View>
  );
};

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
