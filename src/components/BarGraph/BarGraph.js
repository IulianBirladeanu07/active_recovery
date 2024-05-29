import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BarGraph = ({ dailyCalories, targetCalories, colors }) => {
  // Calculate the average of dailyCalories
  const averageCalories = dailyCalories.reduce((sum, curr) => sum + curr, 0) / dailyCalories.length;
  
  // Determine the maximum scale using a fixed base or max from data
  const baseMaxCalorie = 3000; // Adjust this base to suit typical data ranges
  const maxCalorie = Math.max(baseMaxCalorie, ...dailyCalories, averageCalories, targetCalories);
  const containerHeight = 200; // Fixed container height

  const getSafeHeight = (calories) => {
    const height = (calories / maxCalorie) * containerHeight;
    return Math.min(height, containerHeight); // Ensures height doesn't exceed container
  };

  const renderDottedLine = (position) => (
    <View style={[styles.dottedLine, { bottom: position }]}>
      {Array.from({ length: 20 }).map((_, index) => (
        <View key={index} style={styles.dot} />
      ))}
    </View>
  );

  const renderMilestoneLines = () => {
    const milestones = [];
    const increment = 500;
    for (let i = 1; i * increment <= maxCalorie; i++) {
      const milestoneCalories = increment * i;
      const position = getSafeHeight(milestoneCalories);

      milestones.push(
        <View key={`milestone-${i}`} style={{ position: 'absolute', left: 0, right: 0, bottom: position }}>
          {renderDottedLine(position)}
          <Text style={styles.milestoneText}>{milestoneCalories}</Text>
        </View>
      );
    }
    return milestones;
  };

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {dailyCalories.map((calories, index) => (
          <View key={index} style={[styles.dayContainer, { height: getSafeHeight(calories), backgroundColor: colors[index % colors.length] }]}>
            <Text style={styles.calorieText}>{calories} kcal</Text>
          </View>
        ))}
        {renderMilestoneLines()}
      </View>
      <Text style={styles.averageText}>Avg this week: {averageCalories.toFixed(2)} kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#02202B',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  barsContainer: {
    position: 'relative',
    flexDirection: 'row',
    height: 250,
    alignItems: 'flex-end',
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 7, // Increased margin
    borderRadius: 5,
    zIndex: 3,
  },
  bar: {
    width: 20, // Reduced width for thinner bars
    borderRadius: 5,
    zIndex: 3,
  },
  calorieText: {
    marginTop: 5,
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 8
  },
  averageText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dottedLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  dot: {
    width: 2,
    height: 1,
    backgroundColor: '#008080',
  },
  milestoneText: {
    position: 'absolute',
    left: 0,
    color: '#FFF',
    fontSize: 8,
    transform: [{ translateY: -10 }]
  }
});

export default BarGraph;
