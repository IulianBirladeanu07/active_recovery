// WorkoutScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Octicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../../../components/CustomButton/CustomButton';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import styles from './WorkoutScreenStyles'; // Import styles

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleStartWorkout = () => {
    navigation.navigate('StartWorkout');
  };

  const handleWorkoutHistory = () => {
    navigation.navigate('WorkoutHistory');
  };

  const handleWorkoutExercises = () => {
    navigation.navigate('WorkoutExercises');
  };

  const handleWorkoutMeasurements = () => {
    navigation.navigate('WorkoutMeasurements');
  };

  const isButtonActive = (screenName) => {
    return route.name === screenName;
  };

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<FontAwesome name="cog" size={28} color="#fdf5ec" />}
    >
      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <CustomButton
          icon={<MaterialCommunityIcons name="weight-lifter" size={28} color="#fdf5ec" />}
          label="Start Workout"
          onPress={handleStartWorkout}
        />

        <CustomButton
          icon={<Octicons name="history" size={28} color="#fdf5ec" />}
          label="Workout History"
          onPress={handleWorkoutHistory}
          isActive={isButtonActive('WorkoutHistory')}
        />

        <CustomButton
          icon={<MaterialIcons name="fitness-center" size={28} color="#fdf5ec" />}
          label="Exercises"
          onPress={handleWorkoutExercises}
          isActive={isButtonActive('WorkoutExercises')}
        />

        <CustomButton
          icon={<MaterialCommunityIcons name="scale-bathroom" size={28} color="#fdf5ec" />}
          label="Measurements"
          onPress={handleWorkoutMeasurements}
          isActive={isButtonActive('WorkoutMeasurements')}
        />
      </View>

      {/* Floating "Start Your Workout" Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
        <Text style={styles.startButtonText}>Start Your Workout</Text>
      </TouchableOpacity>
    </ApplicationCustomScreen>
  );
};

export default WorkoutScreen;
