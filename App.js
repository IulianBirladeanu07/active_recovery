import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/main_screens/LoginScreen/LoginScreen';
import HomeScreen from './src/screens/main_screens/HomeScreen/HomeScreen';
import WorkoutScreen from './src/screens/main_screens/WorkoutScreen/WorkoutScreen';
import NutritionScreen from './src/screens/main_screens/NutritionScreen/NutritionScreen';
import ProgressScreen from './src/screens/main_screens/ProgressScreen/ProgressScreen';

import WorkoutExercises from './src/screens/workout_screens/WorkoutExercises/WorkoutExercises';
import WorkoutHistory from './src/screens/workout_screens/WorkoutHistory/WorkoutHistory';
import WorkoutMeasurements from './src/screens/workout_screens/WorkoutMeasurements/WorkoutMeasurements';
import StartWorkout from './src/screens/workout_screens/StartWorkout/StartWorkout';

import ExerciseList from './src/screens/workout_screens/ExerciseList/ExerciseList';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Workout" component={WorkoutScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Nutrition" component={NutritionScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Progress" component={ProgressScreen} />
        <Stack.Screen options={{ headerShown: false }} name="WorkoutExercises" component={WorkoutExercises} />
        <Stack.Screen options={{ headerShown: false }} name="WorkoutHistory" component={WorkoutHistory} />
        <Stack.Screen options={{ headerShown: false }} name="WorkoutMeasurements" component={WorkoutMeasurements} />
        <Stack.Screen options={{ headerShown: false }} name="StartWorkout" component={StartWorkout} />
        <Stack.Screen options={{ headerShown: false }} name="ExerciseList" component={ExerciseList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});