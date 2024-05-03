import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../../../../AppContext';
import WorkoutSummary from '../WorkoutDetails/WorkoutSummary';
import { format } from 'date-fns';

const HistoryScreen = ({ navigation }) => {
  const { workoutHistory } = useContext(AppContext);

  const formatTimestamp = (timestamp) => {
    return format(timestamp.toDate(), "d 'of' MMMM, yyyy ',' HH:mm ");
  };

  const handleWorkoutPress = (workout) => {
    if (workout) {
      const formattedWorkoutData = {
        duration: workout.duration,
        notes: workout.notes,
        exercises: workout.exercises,
        formattedTimestamp: formatTimestamp(workout.timestamp),
        sessionTitle: workout.sessionTitle,
        date: workout.date,
      };
      navigation.navigate('WorkoutDetails', formattedWorkoutData);
    } else {
      console.error('Invalid workout data:', workout);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout History</Text>
      <FlatList
        data={workoutHistory}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleWorkoutPress(item)}
          >
            <WorkoutSummary
              formattedTimestamp={formatTimestamp(item.timestamp)}
              duration={item.duration}
              totalPRs={item.totalPRs}
              exercises={item.exercises}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'center'
  },
});

export default HistoryScreen;
