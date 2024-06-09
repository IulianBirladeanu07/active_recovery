// App.js
import React, { useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider, AppContext } from './AppContext';
import { FoodProvider } from './FoodContext'; // Adjust the path accordingly
import 'firebase/compat/auth';

import LoginScreen from './src/screens/main_screens/LoginScreen/LoginScreen';
import RegistrationScreen from './src/screens/main_screens/LoginScreen/RegistrationScreen';
import HomeScreen from './src/screens/main_screens/HomeScreen/HomeScreen';
import WorkoutScreen from './src/screens/main_screens/WorkoutScreen/WorkoutScreen';
import NutritionScreen from './src/screens/main_screens/NutritionScreen/NutritionScreen';
import ProgressScreen from './src/screens/main_screens/ProgressScreen/ProgressScreen';
import SettingsScreen from './src/components/Settings/SettingsScreen';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import WorkoutHistory from './src/screens/workout_screens/WorkoutHistory/WorkoutHistory';
import WorkoutDetails from './src/screens/workout_screens/WorkoutDetails/WorkoutDetails';
import MeasurementScreen from './src/screens/workout_screens/Measurements/MeasurementsScreen';
import StartWorkout from './src/screens/workout_screens/StartWorkout/StartWorkout';
import ExerciseList from './src/screens/workout_screens/ExerciseList/ExerciseList';
import WorkoutTemplate from './src/screens/workout_screens/WorkoutTemplate/WorkoutTemplate';
import CreateTemplate from './src/screens/workout_screens/WorkoutTemplate/CreateTemplate';
import FoodSelectionScreen from './src/screens/main_screens/NutritionScreen/FoodSelectionScreen';
import FoodDetailScreen from './src/screens/main_screens/NutritionScreen/FoodDetailScreen';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import ChangePasswordScreen from './src/components/ChangePassword/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const MainApp = () => {
  const { authenticated, loading } = useContext(AppContext);

  console.log('isAuth?: ', authenticated);
  console.log('isLoading?: ', loading);

  if (loading) {
    return <SplashScreen />; // Show splash screen while loading
  }

  return (
    <Stack.Navigator>
      {authenticated ? (
        <>
          <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Workout" component={WorkoutScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Nutrition" component={NutritionScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Progress" component={ProgressScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Settings" component={SettingsScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
          <Stack.Screen options={{ headerShown: false }} name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen options={{ headerShown: false }} name="WorkoutHistory" component={WorkoutHistory} />
          <Stack.Screen options={{ headerShown: false }} name="WorkoutDetails" component={WorkoutDetails} />
          <Stack.Screen options={{ headerShown: false }} name="MeasurementsScreen" component={MeasurementScreen} />
          <Stack.Screen options={{ headerShown: false }} name="StartWorkout" component={StartWorkout} />
          <Stack.Screen options={{ headerShown: false }} name="ExerciseList" component={ExerciseList} />
          <Stack.Screen options={{ headerShown: false }} name="WorkoutTemplate" component={WorkoutTemplate} />
          <Stack.Screen options={{ headerShown: false }} name="CreateTemplate" component={CreateTemplate} />
          <Stack.Screen options={{ headerShown: false }} name="FoodSelection" component={FoodSelectionScreen} />
          <Stack.Screen options={{ headerShown: false }} name="FoodDetail" component={FoodDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="RegistrationScreen" component={RegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppProvider>
          <FoodProvider>
            <MainApp />
          </FoodProvider>
        </AppProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
