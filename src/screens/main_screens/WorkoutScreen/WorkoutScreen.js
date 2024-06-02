import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import { styles } from './WorkoutScreenStyles';
import { AppContext } from '../../../../AppContext';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import CircularProgress from '../../../components/CircularProgress/CircularProgress';

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const { workoutsThisWeek, lastWorkout } = useContext(AppContext);

  const handleStartWorkout = () => {
    navigation.replace('StartWorkout');
  };

  // Mock data for demonstration purposes
  const benchPressPr = { actual: 180, desired: 200 };
  const squatPr = { actual: 220, desired: 250 };
  const deadliftPr = { actual: 300, desired: 350 };

  const handleLastWorkout = () => {
    const formattedWorkoutData = {
      note: lastWorkout?.note || '',
      exercises: lastWorkout?.exercises?.map(exercise => ({
        exerciseName: exercise.exerciseName,
        sets: exercise.sets
      })) || [],
    };

    navigation.navigate('StartWorkout', { selectedWorkout: formattedWorkoutData });
  };

  const progress = workoutsThisWeek > 7 ? 1 : workoutsThisWeek / 7;

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<MaterialCommunityIcons name="cog" size={28} color="#fdf5ec" />}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar value={progress} maxValue={7} customText={"Workouts"} />
        </View>
        <View style={styles.circularProgressContainer}>
          <CircularProgress title="Squat" value={140} maxValue={180} size={60} strokeWidth={6} color="#29335c" duration={1500} isModifiable={true} />
          <CircularProgress title="Bench" value={180} maxValue={220} size={60} strokeWidth={6} color="#db2b39" duration={1500} isModifiable={true} />
          <CircularProgress title="Deadlift" value={220} maxValue={260} size={60} strokeWidth={6} color="#20a39e" duration={1500} isModifiable={true} />
        </View>
        <View style={styles.lastWorkoutContainer}>
          {lastWorkout ? (
            <ScrollView
              style={styles.lastWorkoutScroll}
              contentContainerStyle={styles.lastWorkoutContent}
              nestedScrollEnabled={true}
            >
              <TouchableOpacity onPress={handleLastWorkout}>
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
            </ScrollView>
          ) : (
            <View style={styles.noWorkoutsContainer}>
              <Text style={styles.noWorkoutsText}>There are no previous workouts</Text>
            </View>
          )}
        </View>
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('WorkoutHistory')}>
            <Text style={styles.summaryCardText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('WorkoutTemplate')}>
            <Text style={styles.summaryCardText}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('MeasurementsScreen')}>
            <Text style={styles.summaryCardText}>Size tracker</Text>
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
