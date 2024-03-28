import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { handleWeightChange, handleRepsChange, handleValidation, handleAddSet } from './WorkoutHandler';
import styles from '../ExerciseItem/ExerciseInputStyles' // Ensure this path is correct

const ExerciseInput = ({
  exercise,
  exerciseIndex,
  handleWeightChange,
  handleRepsChange,
  handleValidation,
  setExerciseData,
  exerciseData,
  openModal
}) => {
  const renderRightActions = (progress, dragX, onSwipe) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [100, 50, 0, -1],
    });
    return (
      <TouchableOpacity onPress={onSwipe} style={styles.rightAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const handleSwipeToDelete = (exerciseIndex, setIndex) => {
    // Use openModal or another mechanism to confirm before deleting
    openModal({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this set?",
      onConfirm: () => deleteSet(exerciseIndex, setIndex),
    });
  };

  const deleteSet = (exerciseIndex, setIndex) => {
    const newData = [...exerciseData];
    newData[exerciseIndex].sets.splice(setIndex, 1);
    setExerciseData(newData);
  };

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.selectedExerciseName}>{exercise.exerciseName}</Text>
      {exercise.sets.map((data, setIndex) => (
        <Swipeable
          key={setIndex}
          renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, () => handleSwipeToDelete(exerciseIndex, setIndex))}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Weight"
              value={data.weight}
              onChangeText={text => handleWeightChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.inputField}
              placeholder="Reps"
              value={data.reps}
              onChangeText={text => handleRepsChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                styles.validationButton,
                { backgroundColor: data.isValidated ? '#008080' : '#808080' },
              ]}
              onPress={() => handleValidation(exerciseIndex, setIndex, exerciseData, setExerciseData)}
            >
              <Text style={styles.validationButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        </Swipeable>
      ))}
      <TouchableOpacity
        style={styles.addSetButton}
        onPress={() => handleAddSet(exerciseIndex, exerciseData, setExerciseData)}
      >
        <Text style={styles.addSetButtonText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExerciseInput;
