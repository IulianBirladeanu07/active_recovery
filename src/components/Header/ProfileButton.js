// ProfileButton.js

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library

const ProfileButton = () => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    // Navigate to the profile screen
    navigation.navigate('Profile');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleProfilePress}>
      <Icon name="user" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
});

export default ProfileButton;
