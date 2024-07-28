import React, { useContext, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { FoodProvider } from './src/context/FoodContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import WorkoutScreen from './src/screens/WorkoutScreen/WorkoutScreen';
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
import WorkoutTemplate from './src/screens/WorkoutTemplateScreen/WorkoutTemplate';
import CreateTemplate from './src/screens/WorkoutTemplateScreen/CreateTemplate';
import FoodSelectionScreen from './src/screens/FoodSelectionScreen/FoodSelectionScreen';
import FoodDetailScreen from './src/screens/FoodDetailScreen/FoodDetailScreen';
import SplashScreen from './src/components/SplashScreen/SplashScreen';
import ChangePasswordScreen from './src/components/ChangePassword/ChangePasswordScreen';
import StepByStepProfileSetup from './src/components/ProfileSetup/ProfileSetup';
import ForgotPasswordScreen from './src/components/ForgotPassword/ForgotPassword';

const Stack = createNativeStackNavigator();

const AuthenticatedScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Workout" component={WorkoutScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Nutrition" component={NutritionScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Progress" component={ProgressScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
    <Stack.Screen name="WorkoutHistory" component={WorkoutHistory} options={{ headerShown: false }} />
    <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} options={{ headerShown: false }} />
    <Stack.Screen name="Measurements" component={MeasurementScreen} options={{ headerShown: false }} />
    <Stack.Screen name="StartWorkout" component={StartWorkout} options={{ headerShown: false }} />
    <Stack.Screen name="ExerciseList" component={ExerciseList} options={{ headerShown: false }} />
    <Stack.Screen name="WorkoutTemplate" component={WorkoutTemplate} options={{ headerShown: false }} />
    <Stack.Screen name="CreateTemplate" component={CreateTemplate} options={{ headerShown: false }} />
    <Stack.Screen name="FoodSelection" component={FoodSelectionScreen} options={{ headerShown: false }} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AuthenticatedScreensWrapper = () => (
  <FoodProvider>
    <WorkoutProvider>
      <AuthenticatedScreens />
    </WorkoutProvider>
  </FoodProvider>
);

const MainApp = () => {
  const { authenticated, loading, profileSetupComplete } = useContext(AuthContext);

  useEffect(() => {
    console.log('Authenticated:', authenticated, 'Profile Setup Complete:', profileSetupComplete);
  }, [authenticated, profileSetupComplete]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {!authenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        </>
      ) : profileSetupComplete ? (
        <Stack.Screen name="AuthenticatedScreens" component={AuthenticatedScreensWrapper} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="StepByStepProfileSetup" component={StepByStepProfileSetup} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
