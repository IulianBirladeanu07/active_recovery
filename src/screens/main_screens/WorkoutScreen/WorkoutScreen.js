import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import { styles } from './WorkoutScreenStyles';
import { countWorkoutsThisWeek, getLastWorkout } from '../../workout_screens/StartWorkout/WorkoutHandler';


// Custom progress bar component
const ProgressBar = ({ progress }) => (
  <View style={{ flexDirection: 'row', height: 27, backgroundColor: '#E0E0E0', borderRadius: 5 }}>
    <View style={{ flex: progress, backgroundColor: '#e71d27', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} />
    <View style={{ flex: 1 - progress }} />
  </View>
);

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const goalWorkoutsPerWeek = 7;
  const [lastWorkout, setLastWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkoutsThisWeek = async () => {
      try {
        const workoutCount = await countWorkoutsThisWeek();
        setWorkoutsThisWeek(workoutCount);
      } catch (error) {
        console.error('Error fetching workouts for this week:', error.message);
      }
    };

    const fetchLastWorkoutDetails = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          throw new Error('User not authenticated.');
        }
        
        const lastWorkoutData = await getLastWorkout();
        setLastWorkout(lastWorkoutData);
      } catch (error) {
        console.error('Error fetching last workout details:', error.message);
      }
    };

    fetchWorkoutsThisWeek();
    fetchLastWorkoutDetails();
  }, []);

  const handleStartWorkout = () => {
    navigation.navigate('StartWorkout');
  };

const handleLastWorkout = () => {
  console.log('Last Workout:', lastWorkout);
  
  // Format the last workout data
  const formattedWorkoutData = {
    note: lastWorkout?.note || '', // Set the note as an empty string if it doesn't exist
    exercises: lastWorkout?.exercises?.map(exercise => ({
      exerciseName: exercise.exerciseName,
      sets: exercise.sets
    })) || [], // Map exercises to the required structure
  };

  console.log('Formatted Workout Data:', formattedWorkoutData);
  
  navigation.navigate('StartWorkout', { selectedWorkout: formattedWorkoutData });
};
  
  

  const progress = workoutsThisWeek / goalWorkoutsPerWeek;

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<MaterialCommunityIcons name="cog" size={28} color="#fdf5ec" />}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { marginRight: 15 }]}>Dashboard</Text>
        </View>
        <View style={[styles.progressBarContainer, { marginTop: 10 }]}>
          <ProgressBar progress={progress} />
          <Text style={styles.progressBarValue}>{workoutsThisWeek} / {goalWorkoutsPerWeek} days</Text>
        </View>
        {lastWorkout && (
          <TouchableOpacity style={styles.lastWorkoutContainer} onPress={handleLastWorkout}>
            <Text style={styles.lastWorkoutText}>Last Workout:</Text>
            {lastWorkout.exercises && lastWorkout.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>{`${exercise.sets.length} x ${exercise.exerciseName}`}</Text>
                <View style={styles.bestSetContainer}>
                  <Text style={styles.bestSetText}>
                    {exercise.sets && exercise.sets.length > 0
                      ? `${exercise.sets[0].weight} kg x ${exercise.sets[0].reps} reps`
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            ))}
          </TouchableOpacity>
        )}
        <View style={styles.summaryCardsContainer}>
          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => navigation.navigate('WorkoutHistory')}
          >
            <Image source={require('../../../assets/history_list.png')} style={styles.summaryCardIcon} />
            <Text style={styles.summaryCardText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => navigation.navigate('WorkoutExercises')}
          >
            <Image source={require('../../../assets/exercise_list.png')} style={styles.summaryCardIcon} />
            <Text style={styles.summaryCardText}>Exercises</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => navigation.navigate('WorkoutMeasurements')}
          >
            <Image source={require('../../../assets/measurements.png')} style={styles.summaryCardIcon} />
            <Text style={styles.summaryCardText}>Measurements</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Text style={styles.startButtonText}>Start Your Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ApplicationCustomScreen>
  );
};

export default WorkoutScreen;
