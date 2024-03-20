// ExerciseItem.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { exerciseItemStyles } from './ExerciseItemStyle';

const ExerciseItem = ({ exercise, exerciseIndex, handleDeleteExercise, handleValidation, handleWeightChange, handleRepsChange, handleAddSet }) => {
    if (!exercise) {
        return null; // Or render a placeholder component or message
      } 
 
    return (
    <Swipeable
      overshootLeft={false}
      containerStyle={exerciseItemStyles.swipeableContainer}
      renderLeftActions={(progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 0.8],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              exerciseItemStyles.deleteContainer,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            {/* You can customize the UI if needed, or leave it empty */}
          </Animated.View>
        );
      }}
      onSwipeableLeftOpen={() => handleDeleteExercise(exerciseIndex)} // This will be called when swiping left completes
    >
      <View key={exerciseIndex} style={exerciseItemStyles.exerciseContainer}>
        <Text style={exerciseItemStyles.selectedExerciseName}>
          {exercise.exerciseName}
        </Text>
        {exercise.sets.map((data, setIndex) => (
          <Animated.View
            key={setIndex}
            style={[
              exerciseItemStyles.inputContainer,
              {
                transform: [
                  {
                    translateX: new Animated.Value(0),
                  },
                ],
              },
            ]}
          >
            <TextInput
              style={exerciseItemStyles.inputField}
              placeholder="Weight"
              value={data.weight}
              onChangeText={(text) =>
                handleWeightChange(text, exerciseIndex, setIndex)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={exerciseItemStyles.inputField}
              placeholder="Reps"
              value={data.reps}
              onChangeText={(text) =>
                handleRepsChange(text, exerciseIndex, setIndex)
              }
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                exerciseItemStyles.validationButton,
                {
                  backgroundColor: data.isValidated ? '#008080' : '#808080',
                },
              ]}
              onPress={() => handleValidation(exerciseIndex, setIndex)}
            >
              <Text style={exerciseItemStyles.validationButtonText}>✓</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
        <TouchableOpacity
          style={exerciseItemStyles.addSetButton}
          onPress={() => handleAddSet(exerciseIndex)}
        >
          <Text style={exerciseItemStyles.addSetButtonText}>Add Set</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

export default ExerciseItem;
