import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ value, maxValue, customText }) => {
  const percentage = (value / maxValue) * 100;
  const fillWidth = `${percentage}%`;
  const barColor = getColor(percentage);

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: fillWidth, backgroundColor: barColor }]} />
      <Text style={styles.progressBarText}>
        {`${value.toFixed(0)} / ${maxValue} ${customText} (${percentage.toFixed(0)}%)`}
      </Text>
    </View>
  );
};

function getColor(percentage) {
  if (percentage < 15) return '#e74c3c';
  if (percentage < 60) return '#3498db';
  return '#2ecc71';
}

const styles = StyleSheet.create({
  progressBarContainer: {
    position: 'relative',
    height: 29,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 7,
  },
  progressBarText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ProgressBar;
