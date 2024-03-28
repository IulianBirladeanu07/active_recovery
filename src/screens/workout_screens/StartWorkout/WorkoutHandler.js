import { format } from 'date-fns';
import { db, collection, setDoc, doc } from '../../../services/firebase';

export const sendWorkoutDataToFirestore = async (
  exerciseData,
  inputText,
  isValidationPressed,
  navigation,
  openAnimatedMessage,
  openModal, // Replaced openModal with openAnimatedMessage for better UX
) => {
  try {
    const hasEmptyOrInvalidInputs = exerciseData.some(exercise =>
      exercise.sets.some(set =>
        set.weight.trim() === '' || set.reps.trim() === '' ||
        !/^\d+$/.test(set.weight) || !/^\d+$/.test(set.reps)
      )
    );

    if (hasEmptyOrInvalidInputs) {
      openAnimatedMessage('Note: Some sets have empty or invalid weight/reps. These sets will be saved as is.');
    } else if (!isValidationPressed) {
      openModal('Some sets are not validated. Do you wish to proceed anyway?', async () => {
        // This callback is now correctly set up to be called after user confirmation.
        await finishWorkout(exerciseData, inputText, navigation, true, openAnimatedMessage);
      });

    } else {
      // All sets are validated and have valid inputs, proceed directly to finish the workout
      await finishWorkout(exerciseData, inputText, navigation, false, openAnimatedMessage);
    }  } catch (error) {
    console.error('Error adding workout data:', error.message);
    // Consider handling errors differently or ensure openAnimatedMessage can appropriately display them
    openAnimatedMessage(`Error: ${error.message}`);
  }
};

// Separated logic for finishing the workout to reduce redundancy
async function finishWorkout(exerciseData, inputText, navigation, includeInvalidInputs, openAnimatedMessage) {
  const workoutDataToSend = {
    timestamp: new Date(),
    note: inputText,
    exercises: exerciseData.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => ({
        weight: set.weight.trim() !== '' && /^\d+$/.test(set.weight) ? set.weight : '0',
        reps: set.reps.trim() !== '' && /^\d+$/.test(set.reps) ? set.reps : '0',
        isValidated: set.isValidated
      }))
    })),
  };

  const formattedTimestamp = format(workoutDataToSend.timestamp, 'EEEE, MMMM d, yyyy h:mm a');
  const workoutDocRef = doc(collection(db, 'Workouts'), formattedTimestamp);
  await setDoc(workoutDocRef, workoutDataToSend);

  console.log('Workout data added to Firestore!');
  navigation.goBack();
}

// Navigation handler to add exercises
export const handleAddExercises = (navigation) => {
  navigation.navigate('ExerciseList');
};

// Handler for toggling the validation state of a set
export const handleValidation = (exerciseIndex, setIndex, exerciseData, setExerciseData, setIsValidationPressed) => {
  const updatedData = [...exerciseData];
  updatedData[exerciseIndex].sets[setIndex].isValidated = !updatedData[exerciseIndex].sets[setIndex].isValidated;
  setExerciseData(updatedData);

  const allSetsValidated = updatedData.every(exercise =>
    exercise.sets.every(set => set.isValidated)
  );

  setIsValidationPressed(allSetsValidated);
};

// Handler for changing the input text note
export const handleInputChange = (text, setInputText) => {
  setInputText(text);
};

// Handler to add a new set to an exercise
export const handleAddSet = (exerciseIndex, exerciseData, setExerciseData) => {
  const updatedData = [...exerciseData];
  const newSet = { weight: '', reps: '', isValidated: false };
  updatedData[exerciseIndex].sets.push(newSet);
  setExerciseData(updatedData);
};

// Handler for changing the weight of a set
export const handleWeightChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData, openModal) => {
  if (/^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].weight = text;
    setExerciseData(updatedData);
  } else {
    openModal('Error', 'Please enter a valid positive integer for weight.');
  }
};

// Handler for changing the reps of a set
export const handleRepsChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData, openModal) => {
  if (/^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].reps = text;
    setExerciseData(updatedData);
  } else {
    openModal('Error', 'Please enter a valid positive integer for reps.');
  }
};
