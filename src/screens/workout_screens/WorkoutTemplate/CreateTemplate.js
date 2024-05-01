// CreateTemplate.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addTemplateToFirestore } from '../StartWorkout/WorkoutHandler';
import { styles } from './CreateTemplateStyle';

const CreateTemplate = ({ navigation, route }) => {
  const [templateName, setTemplateName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseNames, setSelectedExerciseNames] = useState([]);

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
      <View key={index}>
        <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        <View style={styles.row}>
          <View style={[styles.column, { marginRight: 10 }]}>
            <TextInput
              style={styles.input}
              placeholder="Number of sets"
              onChangeText={(text) => handleSetInputChange(text, index)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.column}>
            <TextInput
              style={styles.input}
              placeholder="Reps"
              onChangeText={(text) => handleRepsInputChange(text, index)}
              keyboardType="numeric"
            />
          </View>
        </View>
        {index === exercises.length - 1 && (
          <TouchableOpacity onPress={handleAddExercise}>
            <Text style={styles.addButton}>Add Exercise</Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  const handleCreateTemplate = () => {
    // Trim the templateName to remove any leading or trailing whitespace
    const trimmedTemplateName = templateName.trim();

    // Check if the trimmed templateName is not empty
    if (!trimmedTemplateName) {
      // Provide feedback to the user that the template name is required
      alert("Template name is required.");
      return; // Stop the function if the template name is not valid
    }

    // Check if any exercises have no sets or reps specified
    const invalidExercise = exercises.find(exercise => {
      // Check if any set has invalid reps
      const invalidSet = exercise.sets.find(set => {
        // Check if reps are not a positive integer
        return set.reps.trim() === '' || !/^\d+$/.test(set.reps);
      });

      // Return true if any set has invalid reps
      return exercise.sets.length === 0 || invalidSet;
    });

    if (invalidExercise) {
      alert("Please specify valid values for sets and reps for each exercise.");
      return; // Stop the function if any exercise is invalid
    }

    const templateData = {
      templateName: trimmedTemplateName, // Use the trimmed name for consistency
      exercises: exercises,
    };

    // Attempt to add the template to Firestore
    addTemplateToFirestore(templateData, trimmedTemplateName)
      .then(() => {
        console.log('Template created:', templateData);
        if (route.params && route.params.refreshTemplates) {
          console.log('regf')
          route.params.refreshTemplates(); // Invoke the refreshTemplates callback function
        }
        navigation.replace('WorkoutTemplate');
      })
      .catch((error) => {
        // Handle errors here, possibly adjusting the UI to show an error message
        console.error("Error creating template:", error.message);
        alert(`Error: ${error.message}`);
      });
  };

  const handleSetInputChange = (text, exerciseIndex) => {
    if (text.trim() === '') {
      Alert.alert("Invalid input", "Sets cannot be empty.");
      return;
    }
    const numberOfSets = parseInt(text);
    if (!Number.isInteger(numberOfSets) || numberOfSets <= 0) {
      Alert.alert("Invalid input", "Sets must be a positive integer.");
      return;
    }

    const updatedExercises = [...exercises];
    const setsAdjustment = new Array(numberOfSets).fill().map(() => ({ reps: '', weight: '' }));
    updatedExercises[exerciseIndex].sets = setsAdjustment;
    setExercises(updatedExercises);
  };

  const handleRepsInputChange = (text, exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.forEach(set => {
      set.reps = text; // Update reps for all sets of the exercise
    });
    setExercises(updatedExercises);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Template Name"
        value={templateName}
        onChangeText={text => setTemplateName(text)}
      />
      {exercises.length === 0 && (
        <TouchableOpacity onPress={handleAddExercise}>
          <Text style={styles.addButton}>Add Exercise</Text>
        </TouchableOpacity>
      )}
      <ScrollView>
        {renderSetInputs()}
      </ScrollView>
      {exercises.length > 0 && (
        <TouchableOpacity onPress={handleCreateTemplate}>
          <Text style={styles.createTemplateButton}>Create Template</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateTemplate;
