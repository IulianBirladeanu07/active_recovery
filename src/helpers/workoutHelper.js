import { format } from 'date-fns';
import { View, Text, TextInput, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';

// Assuming these are imported from wherever appropriate
import { db, doc, setDoc, collection } from '../services/firebase';
import styles from '../screens/workout_screens/StartWorkout/StartWorkoutStyles';

const openModal = (message, setIsModalVisible, setModalMessage) => {
  setModalMessage(message);
  setIsModalVisible(true);
};

export const sendWorkoutDataToFirestore = async (inputText, exerciseData, setIsModalVisible, setModalMessage) => {
  try {
    const hasEmptyOrInvalidInputs = exerciseData.some((exercise) => {
      return exercise.sets.some((set) => {
        return (
          set.weight.trim() === '' ||
          set.reps.trim() === '' ||
          set.weight.toLowerCase() === 'weights' ||
          set.reps.toLowerCase() === 'reps' ||
          !/^\d+$/.test(set.weight) ||
          !/^\d+$/.test(set.reps)
        );
      });
    });

    if (hasEmptyOrInvalidInputs) {
      openModal(
        'Some sets or reps are not filled, are you sure you want to finish the workout?',
        setIsModalVisible,
        setModalMessage
      );
    } else {
      const workoutDataToSend = {
        timestamp: new Date(),
        note: inputText,
        exercises: exerciseData,
      };

      // Mock data for demonstration
      const formattedTimestamp = format(
        workoutDataToSend.timestamp,
        'EEEE, MMMM d, yyyy h:mm a'
      );

      // Mock data for demonstration
      const workoutDocRef = doc(collection(db, 'Workouts'), formattedTimestamp);

      // Mock data for demonstration
      // await setDoc(workoutDocRef, workoutDataToSend);
      console.log('Workout data added to Firestore!');
    }
  } catch (error) {
    console.error('Error adding workout data:', error.message);
    openModal(error.message, setIsModalVisible, setModalMessage);
  }
};

export const handleInputChange = (text, setInputText) => {
  setInputText(text);
};

export const handleAddSet = (exerciseIndex, exerciseData, setExerciseData) => {
  const updatedData = [...exerciseData];
  const newSet = { weight: '', reps: '', isValidated: false };
  updatedData[exerciseIndex].sets.push(newSet);
  setExerciseData(updatedData);
};

export const renderSetInputs = (selectedExercise, exerciseData, handleValidation, handleWeightChange, handleRepsChange, handleDeleteExercise, handleAddSet) => {
    const swipeThreshold = 100; // Adjust as needed
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // Implement swipe gesture here if needed
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx < -swipeThreshold) {
          // Swiped left, trigger deletion
          handleDeleteExercise();
        }
        // You can handle other gestures if needed
      },
    });
  
    return selectedExercise ? exerciseData.map((exercise, exerciseIndex) => (
      <View key={exerciseIndex} style={styles.exerciseContainer}>
        <Text style={styles.selectedExerciseName}>
          {exercise.exerciseName}
        </Text>
        {exercise.sets.map((data, setIndex) => (
          <Animated.View
            key={setIndex}
            style={[
              styles.inputContainer,
              // You can apply animations or transformations here if needed
            ]}
            {...panResponder.panHandlers}
          >
            <TextInput
              style={styles.inputField}
              placeholder="Weight"
              value={data.weight}
              onChangeText={(text) => handleWeightChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.inputField}
              placeholder="Reps"
              value={data.reps}
              onChangeText={(text) => handleRepsChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                styles.validationButton,
                {
                  backgroundColor: data.isValidated ? '#008080' : '#808080',
                },
              ]}
              onPress={() => handleValidation(exerciseIndex, setIndex, exerciseData, setExerciseData, setIsValidationPressed)}
            >
              <Text style={styles.validationButtonText}>✓</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
        {/* Add Set Button */}
        <TouchableOpacity onPress={() => handleAddSet(exerciseIndex, exerciseData, setExerciseData)}>
          <Text>Add Set</Text>
        </TouchableOpacity>
      </View>
    )) : null;
  };
  
export const handleValidation = (exerciseIndex, setIndex, exerciseData, setExerciseData, setIsValidationPressed) => {
  const updatedData = [...exerciseData];
  updatedData[exerciseIndex].sets[setIndex].isValidated = !updatedData[exerciseIndex].sets[setIndex].isValidated;
  setExerciseData(updatedData);

  const allSetsValidated = updatedData[exerciseIndex].sets.every(
    (set) => set.isValidated
  );

  setIsValidationPressed(allSetsValidated);
};

export const handleWeightChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData) => {
  if (/^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].weight = text;
    setExerciseData(updatedData);
  } else {
    Alert.alert(
      'Error',
      'Please enter a valid positive integer for weight.'
    );
  }
};

export const handleRepsChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData) => {
  if (/^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].reps = text;
    setExerciseData(updatedData);
  } else {
    Alert.alert('Error', 'Please enter a valid positive integer for reps.');
  }
};
