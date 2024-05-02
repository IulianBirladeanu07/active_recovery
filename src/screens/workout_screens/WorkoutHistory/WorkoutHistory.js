import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, db } from '../../../services/firebase';
import { format } from 'date-fns';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import WorkoutSummary from '../WorkoutDetails/WorkoutSummary';

const HistoryScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          throw new Error('User not authenticated.');
        }

        const uid = user.uid;

        const querySnapshot = await getDocs(collection(db, 'Workouts'));
        const workoutList = [];
        querySnapshot.forEach((doc) => {
          const workoutData = doc.data();
          // Check if the workout data belongs to the current user
          if (workoutData.uid === uid) {
            workoutList.push(workoutData);
          }
        });
        workoutList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setWorkouts(workoutList);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const formatTimestamp = (timestamp) => {
    return format(timestamp.toDate(), "d 'of' MMMM, yyyy ',' HH:mm ");
  };

  const handleWorkoutPress = useCallback((workout) => {
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
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout History</Text>
      <FlatList
        data={workouts}
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
