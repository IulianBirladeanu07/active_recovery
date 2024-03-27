import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { handleWeightChange, handleRepsChange, handleValidation } from './WorkoutHandler'; // Importing helper functions
import exerciseInputStyles from '../ExerciseItem/ExerciseInputStyles';

const ExerciseInput = ({ exerciseData, setExerciseData }) => {
  return exerciseData.map((exercise, exerciseIndex) => (
    <View style={exerciseInputStyles.container} key={exerciseIndex}>
      <Text style={exerciseInputStyles.selectedExerciseName}>{exercise.exerciseName}</Text>
      {exercise.sets.map((data, setIndex) => (
        <View style={exerciseInputStyles.inputContainer} key={setIndex}>
          <TextInput
            style={exerciseInputStyles.inputField}
            placeholder="Weight"
            value={data.weight}
            onChangeText={text => handleWeightChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData)}
            keyboardType="numeric"
          />
          <TextInput
            style={exerciseInputStyles.inputField}
            placeholder="Reps"
            value={data.reps}
            onChangeText={text => handleRepsChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              exerciseInputStyles.validationButton,
              { backgroundColor: data.isValidated ? '#008080' : '#808080' },
            ]}
            onPress={() => handleValidation(exerciseIndex, setIndex, exerciseData, setExerciseData)}
          >
            <Text style={exerciseInputStyles.validationButtonText}>✓</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={exerciseInputStyles.addSetButton}
        onPress={() => handleAddSet(exerciseIndex, exerciseData, setExerciseData)}
      >
        <Text style={exerciseInputStyles.addSetButtonText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  ));
};

export default ExerciseInput;
