import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { findBestSet } from '../StartWorkout/WorkoutHandler';

const WorkoutSummary = ({ formattedTimestamp, duration, totalPRs, exercises }) => {
  const renderExercises = () => {
    return exercises.map((exercise, index) => {
      const bestSet = findBestSet(exercise.sets);
      return (
        <View key={index} style={styles.exerciseContainer}>
          <Text 
            style={styles.exerciseName} 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {`${exercise.sets.length} x ${exercise.exerciseName}`}
          </Text>
          <View style={styles.bestSetContainer}>
            <Text style={styles.bestSetText}>
              {bestSet.weight && bestSet.reps
                ? `${bestSet.weight} kg x ${bestSet.reps} reps`
                : 'N/A'}
            </Text>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>{formattedTimestamp || 'what'}</Text>
      </View>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
              <Text style={styles.summaryText}>{duration || '0h 0m'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="trophy-outline" size={24} color="white" />
              <Text style={styles.summaryText}>{totalPRs || '0 PRs'}</Text>
            </View>
          </View>

          <View style={styles.exercisesSection}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Exercises</Text>
              <Text style={styles.headerText}>Best Set</Text>
            </View>
            {exercises && exercises.length > 0 ? renderExercises() : <Text style={styles.sectionText}>No exercises available</Text>}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
  },
  timestampContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  timestamp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  wrapper: {
    flex: 1,
    padding: 10,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: '#008080',
    marginBottom: -10,
    marginHorizontal: -20,
  },
  scrollContainer: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 5,
    paddingTop: 5,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  exercisesSection: {
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  bestSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestSetText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: 150,
    overflow: 'hidden',
  },  
  sectionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default WorkoutSummary;
