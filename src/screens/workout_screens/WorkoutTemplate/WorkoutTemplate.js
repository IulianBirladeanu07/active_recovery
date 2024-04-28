import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {styles} from '../../workout_screens/WorkoutTemplate/WorkoutTemplateStyle'
const WorkoutTemplate = ({ navigation }) => {
  // Preset workout templates
  const presetTemplates = [
    { name: 'Upper Lower', exercises: ['Bench Press', 'Squats', 'Pull-ups', 'Deadlifts'], sets: 4, reps: 8 },
    { name: 'Push Pull Legs', exercises: ['Bench Press', 'Pull-ups', 'Squats', 'Leg Press'], sets: 3, reps: 10 },
    { name: 'Bro Split', exercises: ['Biceps Curls', 'Triceps Extensions', 'Shoulder Press', 'Leg Curls'], sets: 5, reps: 12 },
  ];

  // Function to start a workout with the selected template
  const startWorkout = (template) => {
    // Navigate to the StartWorkout screen with the selected template
    navigation.navigate('StartWorkout', { selectedTemplate: template });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.heading}>Preset Templates</Text>
        {presetTemplates.map((template, index) => (
          <TouchableOpacity key={index} onPress={() => startWorkout(template)}>
            <View style={styles.templateContainer}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text>Exercises: {template.exercises.join(', ')}</Text>
              <Text>Sets: {template.sets}</Text>
              <Text>Reps: {template.reps}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('CreateTemplate')}>
          <Text style={styles.createTemplateButton}>Create Your Own Template</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WorkoutTemplate;
