// HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import CircularProgress from '../../../components/CircularProgress/CircularProgress';
import StepCounter from '../../../components/StepCounter/StepCounter';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Mock data for visual demonstration
  const dailyActivity = {
    workoutTime: '45 mins',
    caloriesBurned: '500 kcal',
    exercisesCompleted: '5 exercises',
    caloricIntake: '2000 kcal'
  };

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<FontAwesome name="cog" size={28} color="#fdf5ec" />}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Home Dashboard</Text>

        {/* Summary of Today's Activity with Icons */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <Text style={styles.summaryText}>Workout Time: {dailyActivity.workoutTime}</Text>
          <Text style={styles.summaryText}>Calories Burned: {dailyActivity.caloriesBurned}</Text>
          <Text style={styles.summaryText}>Exercises Completed: {dailyActivity.exercisesCompleted}</Text>
          <Text style={styles.summaryText}>Caloric Intake: {dailyActivity.caloricIntake}</Text>
        </View>

        {/* Progress Bar for Weekly Activity */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Weekly Workout Goal</Text>
          <ProgressBar value={0.5} maxValue={1} style={styles.progressBar} />
          <StepCounter />
        </View>

        {/* Circular Progress Indicators */}
        <View style={styles.circularProgressContainer}>
          <CircularProgress title="Weight Goal" value={180} maxValue={200} size={120} strokeWidth={10} color="#4caf50" duration={500} />
        </View>

      </ScrollView>
    </ApplicationCustomScreen>
  );
};

// Styles for the HomeScreen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#02111B',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#02202B',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  progressContainer: {
    marginBottom: 20,
  },
  circularProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 20,
  },
});

export default HomeScreen;
