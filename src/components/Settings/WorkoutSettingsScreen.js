import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const WorkoutSettingsScreen = ({ navigation }) => {
  const [workoutGoals, setWorkoutGoals] = useState('');
  const [workoutReminders, setWorkoutReminders] = useState('');
  const [workoutFrequency, setWorkoutFrequency] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout Settings</Text>

      <Text style={styles.subHeader}>Workout Goals</Text>
      <TextInput
        style={styles.input}
        value={workoutGoals}
        onChangeText={setWorkoutGoals}
        placeholder="Enter your workout goals"
        placeholderTextColor="#777"
      />

      <Text style={styles.subHeader}>Workout Reminders</Text>
      <TextInput
        style={styles.input}
        value={workoutReminders}
        onChangeText={setWorkoutReminders}
        placeholder="Enter your workout reminders"
        placeholderTextColor="#777"
      />

      <Text style={styles.subHeader}>Workout Frequency</Text>
      <TextInput
        style={styles.input}
        value={workoutFrequency}
        onChangeText={setWorkoutFrequency}
        placeholder="Enter your workout frequency"
        placeholderTextColor="#777"
        keyboardType="numeric"
      />

      <Button title="Save Settings" onPress={() => alert('Settings Saved')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default WorkoutSettingsScreen;
