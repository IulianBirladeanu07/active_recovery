import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import styles from './WorkoutScreenStyles'; // Import styles

const WorkoutScreen = () => {
  const navigation = useNavigation();

  const handleStartWorkout = () => {
    navigation.navigate('StartWorkout');
  };

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<FontAwesome name="cog" size={28} color="#fdf5ec" />}
    >
      {/* Dashboard Layout */}
      <View style={styles.dashboardContainer}>
        {/* Workout History Summary Card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={() => navigation.navigate('WorkoutHistory')}
        >
          <Text style={styles.summaryCardText}>Workout History</Text>
          <Text style={styles.summaryCardDetails}>Total Workouts: 10</Text>
        </TouchableOpacity>

        {/* Exercises Summary Card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={() => navigation.navigate('WorkoutExercises')}
        >
          <Text style={styles.summaryCardText}>Exercises</Text>
          <Text style={styles.summaryCardDetails}>Exercises in Routine: 8</Text>
        </TouchableOpacity>

        {/* Measurements Summary Card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={() => navigation.navigate('WorkoutMeasurements')}
        >
          <Text style={styles.summaryCardText}>Measurements</Text>
          <Text style={styles.summaryCardDetails}>Latest Measurements: 36-24-36</Text>
        </TouchableOpacity>
      </View>

      {/* Floating "Start Your Workout" Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
        <Text style={styles.startButtonText}>Start Your Workout</Text>
      </TouchableOpacity>
    </ApplicationCustomScreen>
  );
};

export default WorkoutScreen;
