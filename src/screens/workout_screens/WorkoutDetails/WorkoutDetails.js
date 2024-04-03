import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { calculate1RM } from '../../workout_screens/StartWorkout/WorkoutHandler';
import { db, collection, getDocs, query, where } from '../../../services/firebase'; // Import Firestore functions

const WorkoutDetails = ({ route }) => {
  const { duration, notes, exercises, formattedTimestamp, sessionTitle, date } = route.params;
  const [totalPRs, setTotalPRs] = useState(0); // State to store total PRs

  useEffect(() => {
    const countTotalPRs = async () => {
      let total = 0;
      const exerciseNames = exercises.map(exercise => exercise.exerciseName);
      
      // Batch query to retrieve all relevant 1RM documents for the exercises
      const querySnapshot = await getDocs(query(collection(db, 'Workouts'), where('exerciseName', 'in', exerciseNames)));
      console.log('Query Snapshot:', querySnapshot); // Log the query snapshot
      
      // Map each exercise to its latest 1RM value
      const exercise1RMs = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const exerciseName = data.exerciseName;
        const value = parseFloat(data.estimated1RM); // Parse the estimated1RM value as float
        exercise1RMs[exerciseName] = Math.max(exercise1RMs[exerciseName] || 0, value);
      });
      console.log('Exercise 1RMs:', exercise1RMs, exerciseNames); // Log the exercise 1RM values
      
      // Check if exercise1RMs is not empty before counting PRs
      if (Object.keys(exercise1RMs).length > 0) {
        // Calculate PRs based on the retrieved 1RM values
        exercises.forEach(exercise => {
          const exerciseName = exercise.exerciseName;
          const current1RM = calculate1RM(parseFloat(exercise.sets[0].weight), parseInt(exercise.sets[0].reps, 10));
          const prev1RM = exercise1RMs[exerciseName] || 0;
          if (current1RM > prev1RM) {
            total++;
          }
        });
      }
      console.log('Total PRs:', total); // Log the total PRs
    
      setTotalPRs(total);
    };
  
    countTotalPRs();
  }, [exercises]);
  
  // Helper function to find the best set based on the highest 1RM
  const findBestSet = (sets) => {
    return sets.reduce((best, set) => {
      const current1RM = calculate1RM(parseFloat(set.weight), parseInt(set.reps, 10));
      return current1RM > best.estimated1RM ? { ...set, estimated1RM: current1RM } : best;
    }, { estimated1RM: 0 });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{formattedTimestamp || 'what'}</Text>
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
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise, index) => {
            const bestSet = findBestSet(exercise.sets);
            return (
              <View key={index} style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>{`${exercise.sets.length} x ${exercise.exerciseName}`}</Text>
                <View style={styles.bestSetContainer}>
                  <Text style={styles.bestSetText}>
                    {bestSet.weight && bestSet.reps
                      ? `${bestSet.weight} kg x ${bestSet.reps} reps (1RM: ${bestSet.estimated1RM.toFixed(1)} kg)`
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.sectionText}>No exercises available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 100,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 10,
    paddingTop: 30,
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
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
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
    color: '#FFFFFF',
  },
  sectionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default WorkoutDetails;
