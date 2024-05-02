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
    console.log("Route Params:", route.params);
    if (route.params && route.params.selectedTemplate) {
      const { selectedTemplate: { data: { templateName, exercises } } } = route.params;
      console.log("Selected Template:", templateName, exercises);
      
      // Set templateName
      setTemplateName(templateName);
  
      // Set exercises
      setExercises(exercises);
  
      // Set selectedExerciseNames
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
      <View key={index}>
        <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        <View style={styles.row}>
          <View style={[styles.column, { marginRight: 10 }]}>
          <TextInput
            style={styles.input}
            placeholder="Number of sets"
            value={String(exercise.sets.length)} // Display the total number of sets
            onChangeText={(text) => handleSetInputChange(text, index)} // Pass exercise index
            keyboardType="numeric"
          />
          </View>
          <View style={styles.column}>
            <TextInput
                style={styles.input}
                placeholder="Reps"
                value={exercise.sets.length > 0 ? exercise.sets[0].reps : ''} // Display reps of the first set
                onChangeText={(text) => handleRepsInputChange(text, index, 0)} // Pass exercise index and set index
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
      // If input is empty, consider it as deleting the sets
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
    // If the new number of sets is less than the current number, remove the excess sets
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.slice(0, numberOfSets);
    // If the new number of sets is more than the current number, add empty sets
    for (let i = updatedExercises[exerciseIndex].sets.length; i < numberOfSets; i++) {
      updatedExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    }
    setExercises(updatedExercises);
  };
    
  const handleRepsInputChange = (text, exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
  
    // Check if the set exists
    if (!updatedExercises[exerciseIndex].sets[setIndex]) {
      updatedExercises[exerciseIndex].sets[setIndex] = { reps: '', weight: '' };
    }
  
    // Update reps for the specified set
    updatedExercises[exerciseIndex].sets[setIndex].reps = text.trim();
  
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
