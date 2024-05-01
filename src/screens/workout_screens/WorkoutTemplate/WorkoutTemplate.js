import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { styles } from '../../workout_screens/WorkoutTemplate/WorkoutTemplateStyle';
import { fetchTemplatesFromFirestore } from '../StartWorkout/WorkoutHandler'; // Import the function to fetch templates

const WorkoutTemplate = ({ navigation }) => {
  const [templates, setTemplates] = useState([]); // State to hold fetched templates
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch templates from Firestore when the component mounts
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await fetchTemplatesFromFirestore();
        console.log(fetchedTemplates);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Handle error fetching templates
      }
    };

    fetchTemplates();
    return () => {
    };
  }, []);

  const refreshTemplates = async () => {
    try {
      const fetchedTemplates = await fetchTemplatesFromFirestore();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRefreshing(true);
      refreshTemplates().then(() => setRefreshing(false));
    });

    return unsubscribe;
  }, [navigation, refreshTemplates]);

  // Function to start a workout with the selected template
  const startWorkoutWithTemplate = (template) => {
    console.log('k')
    if (template && template.data) {
        console.log('tempalte:', template.data);
      navigation.navigate('StartWorkout', { selectedTemplate: template.data });
    } else {
      console.error('Invalid template data:', template);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshTemplates} />
        }
      >
        <Text style={styles.heading}>Preset Templates</Text>
        {templates.map((template, index) => (
          <TouchableOpacity key={index} onPress={() => startWorkoutWithTemplate(template)}>
            <View style={styles.templateContainer}>
              <Text style={styles.templateName}>{template.data.templateName}</Text>
              {template.data.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  {/* Displaying number of sets X reps */}
                  <Text style={styles.text}>
                    {exercise.sets.length} X {exercise.sets[0].reps}
                  </Text>
                </View>
              ))}
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
