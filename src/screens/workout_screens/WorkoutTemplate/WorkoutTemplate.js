import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { styles } from '../../workout_screens/WorkoutTemplate/WorkoutTemplateStyle';
import { fetchTemplatesFromFirestore, deleteTemplateFromFirestore } from '../StartWorkout/WorkoutHandler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WorkoutTemplate = ({ navigation }) => {
  const [templates, setTemplates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await fetchTemplatesFromFirestore();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
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

  const openDropdown = (index) => {
    setDropdownVisibleIndex(index);
  };

  const closeDropdown = () => {
    setDropdownVisibleIndex(null);
  };

  const startWorkoutWithTemplate = (template) => {
    if (template && template.data) {
      navigation.navigate('StartWorkout', { selectedWorkout: template.data });
    } else {
      console.error('Invalid template data:', template);
    }
  };

  const handleDeleteTemplate = async (templateName) => {
    try {
      await deleteTemplateFromFirestore(templateName);
      closeDropdown();
      refreshTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      Alert.alert('Error', 'An error occurred while deleting the template.');
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
          <View key={index} style={styles.templateContainer}>
            <TouchableOpacity onPress={() => startWorkoutWithTemplate(template)}>
              <Text style={styles.templateName}>{template.data.templateName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => openDropdown(index)}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
            </TouchableOpacity>
            {dropdownVisibleIndex === index && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    navigation.navigate('CreateTemplate', { selectedTemplate: template });
                    closeDropdown();
                  }}
                >
                  <MaterialCommunityIcons name="pencil" size={24} color="white" />
                  <Text style={styles.dropdownItemText}>Edit Template</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDeleteTemplate(template.data.templateName)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
                  <Text style={styles.dropdownItemText}>Delete Template</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={closeDropdown}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            {template.data.exercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <Text style={styles.text}>
                  {exercise.sets.length} X {exercise.sets[0].reps}
                </Text>
              </View>
            ))}
          </View>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('CreateTemplate', { template: null })}>
          <View style={styles.createTemplateButton}>
            <Text style={styles.createTemplateButtonText}>Create Your Own Template</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WorkoutTemplate;
