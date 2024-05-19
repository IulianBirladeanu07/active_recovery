import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Profile Settings</Text>
        <TouchableOpacity onPress={() => handleNavigate('PersonalInfo')}>
          <Text style={styles.item}>Personal Information</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('ProfilePicture')}>
          <Text style={styles.item}>Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Nutrition Settings</Text>
        <TouchableOpacity onPress={() => handleNavigate('CalorieGoal')}>    
          <Text style={styles.item}>Daily Calorie Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('MacronutrientGoals')}>
          <Text style={styles.item}>Macronutrient Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('MealReminders')}>
          <Text style={styles.item}>Meal Reminders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Workout Settings</Text>
        <TouchableOpacity onPress={() => handleNavigate('WorkoutGoals')}>
          <Text style={styles.item}>Workout Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('WorkoutReminders')}>
          <Text style={styles.item}>Workout Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('WorkoutFrequency')}>
          <Text style={styles.item}>Workout Frequency</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Notification Settings</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.item}>Meal Notifications</Text>
          <Switch />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.item}>Workout Notifications</Text>
          <Switch />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.item}>General Notifications</Text>
          <Switch />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Data and Privacy Settings</Text>
        <TouchableOpacity onPress={() => handleNavigate('DataSync')}>
          <Text style={styles.item}>Data Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('DataExport')}>
          <Text style={styles.item}>Data Export</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('PrivacySettings')}>
          <Text style={styles.item}>Privacy Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('DataDeletion')}>
          <Text style={styles.item}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>App Settings</Text>
        <TouchableOpacity onPress={() => handleNavigate('Language')}>
          <Text style={styles.item}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Units')}>
          <Text style={styles.item}>Units</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Theme')}>
          <Text style={styles.item}>Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('AppTour')}>
          <Text style={styles.item}>App Tour</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Help and Support</Text>
        <TouchableOpacity onPress={() => handleNavigate('FAQ')}>
          <Text style={styles.item}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('CustomerSupport')}>
          <Text style={styles.item}>Customer Support</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Feedback')}>
          <Text style={styles.item}>Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    color: '#CCCCCC',
    paddingVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default SettingsScreen;
