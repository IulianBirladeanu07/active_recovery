import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './CreateTemplateStyle'; // Import the provided styles

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
    navigation.navigate('ExerciseList', {
      previousScreen: 'CreateTemplate',
      onSelectExercise: (selectedExercise) => {
        if (!selectedExerciseNames.includes(selectedExercise)) {
          setExercises([...exercises, { exerciseName: selectedExercise, sets: [] }]);
          setSelectedExerciseNames([...selectedExerciseNames, selectedExercise]);
        } else {
          alert('Exercise already exists');
        }
      },
    });
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
              onChangeText={(text) => handleRepsChange(text, index)}
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

  const handleSetInputChange = (text, exerciseIndex) => {
    const updatedExercises = [...exercises];
    const numberOfSets = parseInt(text) || 0;
    if (numberOfSets >= 0) {
      const currentSetsLength = updatedExercises[exerciseIndex].sets.length;
      if (numberOfSets > currentSetsLength) {
        for (let i = currentSetsLength; i < numberOfSets; i++) {
          updatedExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
        }
      } else if (numberOfSets < currentSetsLength) {
        updatedExercises[exerciseIndex].sets.splice(numberOfSets);
      }
      setExercises(updatedExercises);
    }
  };

  const handleCreateTemplate = () => {
    const templateData = {
      templateName: templateName,
      exercises: exercises,
    };
    console.log('Template created:', templateData);
  };

  const handleRepsChange = (text, exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].reps = text;
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
