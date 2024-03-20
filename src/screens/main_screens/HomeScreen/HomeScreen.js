// HomeScreen.js
import React from 'react';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../../../components/CustomButton/CustomButton';
import ApplicationCustomScreen from '../../../components/ApplicationCustomScreen/ApplicationCustomScreen';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleWorkoutPress = () => {
    navigation.navigate('Workout');
  };   

  const handleNutritionPress = () => {
    navigation.navigate('Nutrition');
  };

  const handleProgressPress = () => {
    navigation.navigate('Progress')
  };
 
  const isButtonActive = (screenName) => {
    return route.name === screenName;
  };

  return (
    <ApplicationCustomScreen
      headerLeft={<MaterialCommunityIcons name="account" size={28} color="#fdf5ec" />}
      headerRight={<FontAwesome name="cog" size={28} color="#fdf5ec" />}
    >
      <CustomButton
        icon={<MaterialCommunityIcons name="view-dashboard" size={28} color="#fdf5ec" />}
        label="Dashboard"
        onPress={handleHomePress}
        isActive={isButtonActive('Home')}
      />

      <CustomButton
        icon={<MaterialCommunityIcons name="dumbbell" size={28} color="#fdf5ec" />}
        label="Workout"
        onPress={handleWorkoutPress}
        isActive={isButtonActive('Workout')}
      />

      <CustomButton
        icon={<MaterialIcons name="restaurant" size={28} color="#fdf5ec" />}
        label="Nutrition"
        onPress={handleNutritionPress}
        isActive={isButtonActive('Nutrition')}
      />

      <CustomButton
        icon={<FontAwesome name="line-chart" size={28} color="#fdf5ec" />}
        label="Progress"
        onPress={handleProgressPress}
        isActive={isButtonActive('Progress')}
      />

    </ApplicationCustomScreen>
  );
};

export default HomeScreen;
