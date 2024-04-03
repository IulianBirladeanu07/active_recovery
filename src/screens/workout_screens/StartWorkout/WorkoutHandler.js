import { format } from 'date-fns';
import { db, collection, setDoc, doc } from '../../../services/firebase';

export const sendWorkoutDataToFirestore = async (
  exerciseData,
  inputText,
  isValidationPressed,
  navigation,
  openAnimatedMessage,
  openModal,
  formatTime,
  elapsedTime, // Accept formatTime as a parameter
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
        await finishWorkout(exerciseData, inputText, navigation, true, openAnimatedMessage, openModal, formatTime, elapsedTime); // Pass formatTime here
      });

    } else {
      await finishWorkout(exerciseData, inputText, navigation, false, openAnimatedMessage, openModal, formatTime, elapsedTime); // Pass formatTime here
    }
  } catch (error) {
    console.error('Error adding workout data:', error.message);
    openAnimatedMessage(`Error: ${error.message}`);
  }
};

async function finishWorkout(exerciseData, inputText, navigation, includeInvalidInputs, openAnimatedMessage, openModal, formatTime, elapsedTime) {
  const workoutDataToSend = {
    timestamp: new Date(),
    note: inputText,
    exercises: exerciseData.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => {
        const weight = set.weight.trim() !== '' && /^\d+$/.test(set.weight) ? parseFloat(set.weight) : 0;
        const reps = set.reps.trim() !== '' && /^\d+$/.test(set.reps) ? parseInt(set.reps, 10) : 0;
        return {
          weight: weight.toString(),
          reps: reps.toString(),
          isValidated: set.isValidated,
          estimated1RM: reps > 0 ? calculate1RM(weight, reps).toFixed(2) : 'N/A'
        };
      })
    })),
  };

  console.log('Input:', inputText);
  const formattedTimestamp = format(workoutDataToSend.timestamp, 'EEEE, MMMM d, yyyy h:mm a');
  console.log(formattedTimestamp);
  const workoutDocRef = doc(collection(db, 'Workouts'), formattedTimestamp); // Use formattedTimestamp instead of timestamp
  await setDoc(workoutDocRef, workoutDataToSend);

  console.log('Workout data added to Firestore, including estimated 1RM for each set!');
  console.log(formattedTimestamp);

  navigation.navigate('WorkoutDetails', { 
    duration: formatTime(elapsedTime), 
    notes: inputText, 
    exercises: exerciseData,
    formattedTimestamp: formattedTimestamp, // Pass formattedTimestamp instead of timestamp
  });
}

// Calculate 1 Rep Max (1RM) using the given formula
export const calculate1RM = (weight, reps) => {
  return weight / (1.0278 - 0.0278 * reps);
};

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
