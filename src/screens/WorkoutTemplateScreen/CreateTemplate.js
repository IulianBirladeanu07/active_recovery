import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addTemplateToFirestore } from '../../handlers/WorkoutHandler';
import styles from './CreateTemplateStyle';

const CreateTemplate = ({ navigation, route }) => {
  const [templateName, setTemplateName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseNames, setSelectedExerciseNames] = useState([]);
  
  useEffect(() => {
    if (route.params && route.params.selectedTemplate) {
      const { selectedTemplate: { data: { templateName, exercises } } } = route.params;
      setTemplateName(templateName);
      setExercises(exercises);
      const selectedExerciseNames = exercises.map(exercise => exercise.exerciseName);
      setSelectedExerciseNames(selectedExerciseNames);
    }
  }, [route.params]);
  
  useEffect(() => {
    if (route.params && route.params.selectedExercise) {
      const { selectedExercise } = route.params;
      if (!selectedExerciseNames.includes(selectedExercise)) {
        setExercises([...exercises, { exerciseName: selectedExercise, sets: [] }]);
        setSelectedExerciseNames([...selectedExerciseNames, selectedExercise]);
      } else {
        alert('Exercise already added.');
      }
    }
  }, [route.params]);

  const handleAddExercise = () => {
    navigation.setOptions({
      onSelectExercise: (selectedExercise) => {
        if (!selectedExerciseNames.includes(selectedExercise)) {
          setExercises([...exercises, { exerciseName: selectedExercise, sets: [] }]);
          setSelectedExerciseNames([...selectedExerciseNames, selectedExercise]);
        } else {
          alert('Exercise already exists');
        }
      }
    });
    navigation.navigate('ExerciseList', { previousScreen: 'CreateTemplate' });
  };

  const renderSetInputs = () => {
    return exercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseContainer}>
        <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Number of sets"
            value={String(exercise.sets.length)}
            onChangeText={(text) => handleSetInputChange(text, index)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Reps"
            value={exercise.sets.length > 0 ? exercise.sets[0].reps : ''}
            onChangeText={(text) => handleRepsInputChange(text, index, 0)}
          />
        </View>
        {index === exercises.length - 1 && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  const handleCreateTemplate = async () => {
    const templateData = {
      templateName,
      exercises,
    };

    try {
      await addTemplateToFirestore(templateData, templateName);
      if (route.params && route.params.refreshTemplates) {
        route.params.refreshTemplates();
      }
      navigation.replace('WorkoutTemplate');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSetInputChange = (text, exerciseIndex) => {
    if (text.trim() === '') {
      const updatedExercises = [...exercises];
      updatedExercises[exerciseIndex].sets = [];
      setExercises(updatedExercises);
      return;
    }
  
    const numberOfSets = parseInt(text);
    if (!Number.isInteger(numberOfSets) || numberOfSets < 0) {
      Alert.alert("Invalid input", "Sets must be a non-negative integer.");
      return;
    }
  
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.slice(0, numberOfSets);
    for (let i = updatedExercises[exerciseIndex].sets.length; i < numberOfSets; i++) {
      updatedExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    }
    setExercises(updatedExercises);
  };
    
  const handleRepsInputChange = (text, exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
  
    if (!updatedExercises[exerciseIndex].sets[setIndex]) {
      updatedExercises[exerciseIndex].sets[setIndex] = { reps: '', weight: '' };
    }
  
    updatedExercises[exerciseIndex].sets[setIndex].reps = text.trim();
  
    setExercises(updatedExercises);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Template Name"
        value={templateName}
        onChangeText={setTemplateName}
      />
      {exercises.length === 0 && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      )}
      <ScrollView>
        {renderSetInputs()}
      </ScrollView>
      {exercises.length > 0 && (
        <TouchableOpacity style={styles.createTemplateButton} onPress={handleCreateTemplate}>
          <Text style={styles.createTemplateButtonText}>Create Template</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateTemplate;
