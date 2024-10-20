import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ApplicationCustomScreen from '../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import styles from './WorkoutScreenStyles';
import { WorkoutContext } from '../../context/WorkoutContext';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import CircularProgress from '../../components/CircularProgress/CircularProgress';

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const { workoutsThisWeek, totalWorkoutTime, lastWorkout } = useContext(WorkoutContext);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [summaryCardPressed, setSummaryCardPressed] = useState({ history: false, templates: false, measure: false });

  const handleStartWorkout = () => {
    navigation.replace('StartWorkout');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

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

  return (
    <ApplicationCustomScreen
      headerLeft={<Ionicons name="person-circle-outline" size={28} color="#fdf5ec" />}
      headerRight={<Ionicons name="settings-outline" size={28} color="#fdf5ec" />}
      onProfilePress={handleProfilePress}
      onSettingsPress={handleSettingsPress}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Workout Dashboard</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {/* Workout Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.progressRow}>
              <View style={styles.innerProgressItem}>
                <Ionicons name="barbell-outline" size={18} color="#FFA726" />
                <Text style={styles.innerProgressText}>{workoutsThisWeek} Workouts</Text>
              </View>
              <View style={styles.innerProgressItem}>
                <Ionicons name="time-outline" size={18} color="#f57c00" />
                <Text style={styles.innerProgressText}>{totalWorkoutTime} min</Text>
              </View>
            </View>
            <View style={styles.circularProgressContainer}>
              <CircularProgress
                value={workoutsThisWeek}
                maxValue={7}
                size={100}
                strokeWidth={10}
                color="#FFA726"
                measure="W/O"
                duration={1500}
              />
            </View>

            <View style={styles.barContainer}>
              <ProgressBar value={180} maxValue={220} customText="Deadlift" customColor="#4caf50" unit="kg" />
              <ProgressBar value={180} maxValue={220} customText="Bench Press" customColor="#9c27b0" unit="kg" />
              <ProgressBar value={180} maxValue={220} customText="Squat" customColor="#2196f3" unit="kg" />
            </View>
          </View>

          {/* Last Workout Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Workout</Text>
            {lastWorkout ? (
              <ScrollView style={styles.lastWorkoutScroll} contentContainerStyle={styles.lastWorkoutContent} nestedScrollEnabled={true}>
                <TouchableOpacity onPress={handleLastWorkout}>
                  {lastWorkout.exercises &&
                    lastWorkout.exercises.map((exercise, index) => (
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

          {/* Summary Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.summaryContainer}>
              <TouchableOpacity
                style={[styles.summaryCard, summaryCardPressed.history && { transform: [{ scale: 0.95 }] }]}
                onPressIn={() => setSummaryCardPressed({ ...summaryCardPressed, history: true })}
                onPressOut={() => setSummaryCardPressed({ ...summaryCardPressed, history: false })}
                onPress={() => navigation.navigate('WorkoutHistory')}
              >
                <Text style={styles.summaryCardText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.summaryCard, summaryCardPressed.templates && { transform: [{ scale: 0.95 }] }]}
                onPressIn={() => setSummaryCardPressed({ ...summaryCardPressed, templates: true })}
                onPressOut={() => setSummaryCardPressed({ ...summaryCardPressed, templates: false })}
                onPress={() => navigation.navigate('WorkoutTemplate')}
              >
                <Text style={styles.summaryCardText}>Templates</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.summaryCard, summaryCardPressed.measure && { transform: [{ scale: 0.95 }] }]}
                onPressIn={() => setSummaryCardPressed({ ...summaryCardPressed, measure: true })}
                onPressOut={() => setSummaryCardPressed({ ...summaryCardPressed, measure: false })}
                onPress={() => navigation.navigate('MeasurementsScreen')}
              >
                <Text style={styles.summaryCardText}>Measure</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Start Workout Button (fixed) */}
        <TouchableOpacity
          style={[styles.startButton, { transform: buttonPressed ? [{ scale: 0.95 }] : [{ scale: 1 }] }]}
          onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}
          onPress={handleStartWorkout}
        >
          <Text style={styles.startButtonText}>Start Your Workout</Text>
        </TouchableOpacity>
      </View>
    </ApplicationCustomScreen>
  );
};

export default WorkoutScreen;
