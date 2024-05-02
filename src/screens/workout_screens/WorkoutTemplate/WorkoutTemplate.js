import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
  StyleSheet
} from 'react-native';
import { styles } from '../../workout_screens/WorkoutTemplate/WorkoutTemplateStyle';
import { fetchTemplatesFromFirestore } from '../StartWorkout/WorkoutHandler';
import style from 'react-native-datepicker/style';

const WorkoutTemplate = ({ navigation }) => {
  const [templates, setTemplates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState(null);

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

  const openDropdown = (template) => {
    setSelectedTemplateForEdit(template);
    setIsDropdownVisible(true);
  };

  const startWorkoutWithTemplate = (template) => {
    if (template && template.data) {
      navigation.navigate('StartWorkout', { selectedWorkout: template.data });
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
              <TouchableOpacity style={styles.editButton} onPress={() => openDropdown(template)}>
                <Text style={styles.editButtonText}>•••</Text>
              </TouchableOpacity>
              {template.data.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  <Text style={styles.text}>
                    {exercise.sets.length} X {exercise.sets[0].reps}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('CreateTemplate', { template: selectedTemplateForEdit })}>
          <Text style={styles.createTemplateButton}>Create Your Own Template</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDropdownVisible}
        onRequestClose={() => {
          setIsDropdownVisible(!isDropdownVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setIsDropdownVisible(false)}
            >
              <Text style={styles.textStyle}>Hide</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                navigation.navigate('CreateTemplate', { selectedTemplate: selectedTemplateForEdit });
                setIsDropdownVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Edit Template</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default WorkoutTemplate;
