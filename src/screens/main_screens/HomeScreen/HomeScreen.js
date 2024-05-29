// HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import CircularProgress from '../../../components/CircularProgress/CircularProgress';
import BarGraph from '../../../components/BarGraph/BarGraph'; // Assuming you have a BarGraph component

const HomeScreen = () => {

  // Mock data for visual demonstration
  const dailyCalories = [1000, 3800, 2000, 3500, 3600, 4000, 3400];
  const totalCalories = dailyCalories.reduce((acc, curr) => acc + curr, 0);
  const averageCalories = Math.round(totalCalories / dailyCalories.length);

  const dailyActivity = {
    workoutTime: '30 mins',
    caloriesBurned: '300 kcal',
    exercisesCompleted: '5 exercises',
    caloricIntake: '2000 kcal',
    recentWorkout: 'Morning Yoga',
    recentMeal: 'Breakfast: Oatmeal and fruits'
  };

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<FontAwesome name="cog" size={28} color="#fdf5ec" />}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Home Dashboard</Text>

        {/* Circular Progress Indicators for Weight Goal */}
        <View style={styles.circularProgressContainer}>
          <CircularProgress title="Weight Goal" value={180} maxValue={200} size={120} strokeWidth={10} color="#4caf50" duration={500} />
        </View>

        {/* Containers for Recent Workout and Meal */}
        <View style={styles.recentActivityContainer}>
          <View style={styles.recentWorkoutContainer}>
            <Text style={styles.sectionTitle}>Most Recent Workout</Text>
            <Text style={styles.summaryText}>{dailyActivity.recentWorkout}</Text>
          </View>
          <View style={styles.recentMealContainer}>
            <Text style={styles.sectionTitle}>Most Recent Meal</Text>
            <Text style={styles.summaryText}>{dailyActivity.recentMeal}</Text>
          </View>
        </View>

        {/* Bar Graph for Weekly Calorie Goal */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>Weekly Calorie Intake</Text>
            <BarGraph 
              dailyCalories={dailyCalories} 
              targetCalories={2500}
              colors={['#4caf50', '#2196f3', '#ffeb3b', '#ff9800', '#009688', '#673ab7', '#e91e63']}
              /> 
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
  circularProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  recentActivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  recentWorkoutContainer: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#02202B',
    borderRadius: 10,
  },
  recentMealContainer: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#02202B',
    borderRadius: 10,
  },
  graphContainer: {
    marginBottom: 20,
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
  progressBar: {
    width: '100%',
    height: 20,
  },
});

export default HomeScreen;
