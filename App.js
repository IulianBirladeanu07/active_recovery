import React, { useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { FoodProvider } from './src/context/FoodContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import WorkoutScreen from './src/screens/WorkoutScreen/WorkoutScreen'
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';

import NutritionScreen from './src/screens/NutritionScreen/NutritionScreen';
import ProgressScreen from './src/screens/ProgressScreen/ProgressScreen';
import SettingsScreen from './src/components/Settings/SettingsScreen';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import WorkoutHistory from './src/screens/WorkoutHistoryScreen/WorkoutHistory';
import WorkoutDetails from './src/screens/WorkoutDetailsScreen/WorkoutDetails';
import MeasurementScreen from './src/screens/MeasurementsScreen/MeasurementsScreen';
import StartWorkout from './src/screens/StartWorkoutScreen/StartWorkout';
import ExerciseList from './src/screens/ExerciseListScreen/ExerciseList';
import WorkoutTemplate from './src/screens/WorkoutTemplateScreen/WorkoutTemplate'
import CreateTemplate from './src/screens/WorkoutTemplateScreen/CreateTemplate';
import FoodSelectionScreen from './src/screens/FoodSelectionScreen/FoodSelectionScreen';
import FoodDetailScreen from './src/screens/FoodDetailScreen/FoodDetailScreen';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import ChangePasswordScreen from './src/components/ChangePassword/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const MainApp = () => {
  const { authenticated, loading } = useContext(AuthContext);

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
        <AuthProvider>
          <WorkoutProvider>
            <FoodProvider>
              <MainApp />
            </FoodProvider>
          </WorkoutProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
