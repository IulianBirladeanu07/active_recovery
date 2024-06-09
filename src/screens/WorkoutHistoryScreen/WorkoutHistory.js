import React, { useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { WorkoutContext } from '../../context/WorkoutContext';
import WorkoutSummary from '../../screens/WorkoutDetailsScreen/WorkoutSummary'
import { format } from 'date-fns';
import styles from './WorkoutHistoryStyles';

const HistoryScreen = ({ navigation }) => {
  const { workoutHistory } = useContext(WorkoutContext);

  const formatTimestamp = (timestamp) => {
    return format(timestamp.toDate(), "d 'of' MMMM, yyyy ',' HH:mm ");
  };

  const handleWorkoutPress = useCallback((workout) => {
    if (workout) {
      const formattedWorkoutData = {
        note: workout.note,
        exercises: workout.exercises.map((exercise) => ({
          exerciseName: exercise.exerciseName,
          sets: exercise.sets.map((set) => {
            return {
              weight: set.weight.toString(),
              reps: set.reps.toString(),
              isValidated: set.isValidated,
            };
          }),
        })),
      };

      console.log('Formatted Workout Data:', formattedWorkoutData);
      navigation.navigate('StartWorkout', { selectedWorkout: formattedWorkoutData });
    } else {
      console.error('Invalid workout data:', workout);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout History</Text>
      <FlatList
        data={workoutHistory}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleWorkoutPress(item)}
          >
            <WorkoutSummary
              formattedTimestamp={formatTimestamp(item.timestamp)}
              duration={item.duration}
              totalPRs={item.totalPRs || 0}
              exercises={item.exercises}
              notes={item.notes}
              // completionStatus={completionStatus}
              // comparisonData={comparisonData}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HistoryScreen;
