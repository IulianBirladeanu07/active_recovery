import { format } from 'date-fns';
import { db, collection, setDoc, getDocs, doc, query, where, orderBy, limit } from '../../../services/firebase';

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
      openAnimatedMessage('Note: Some sets have empty or invalid weight/reps.');
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

  const formattedTimestamp = format(workoutDataToSend.timestamp, 'EEEE, MMMM d, yyyy H:mm');
  console.log(formattedTimestamp);
  const workoutDocRef = doc(collection(db, 'Workouts'), formattedTimestamp); // Use formattedTimestamp instead of timestamp
  await setDoc(workoutDocRef, workoutDataToSend);

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


  // Function to count total PRs
export const countTotalPRs = (lastWorkoutData) => {
    let total = 0;
    lastWorkoutData.exercises.forEach(exercise => {
      const bestSet = findBestSet(exercise.sets);
      if (bestSet) {
        total++;
      }
    });
    setTotalPRs(total);
  };

  // Helper function to find the best set based on the highest 1RM
 export const findBestSet = (sets) => {
    return sets.reduce((best, set) => {
      const current1RM = calculate1RM(parseFloat(set.weight), parseInt(set.reps, 10));
      return current1RM > best.estimated1RM ? { ...set, estimated1RM: current1RM } : best;
    }, { estimated1RM: 0 });
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
export const handleWeightChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData, openAnimatedMessage) => {
  if (text === '' || /^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].weight = text;
    setExerciseData(updatedData);
  } else {
    openAnimatedMessage('Error', 'Please enter a valid positive integer for weight.');
  }
};

// Handler for changing the reps of a set
export const handleRepsChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData, openAnimatedMessage) => {
  if (text === '' || /^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].reps = text;
    setExerciseData(updatedData);
  } else {
    openAnimatedMessage('Error', 'Please enter a valid positive integer for reps.');
  }
};

export const getSetsFromLastWorkout = async (exerciseName) => {
  try {
    const workoutsRef = collection(db, 'Workouts');
    const querySnapshot = await getDocs(query(workoutsRef, orderBy('timestamp', 'desc'), limit(5)));

    for (const doc of querySnapshot.docs) {
      const workoutData = doc.data();
      const exercises = workoutData.exercises || [];
      const exercise = exercises.find(ex => ex.exerciseName === exerciseName);

      if (exercise) {
        const lastWorkoutSets = exercise.sets.map(set => `${set.weight} kg x ${set.reps}`);
        return lastWorkoutSets; // Directly return the sets array
      }
    }
    return [];
  } catch (error) {
    console.error('Error retrieving sets from last workout:', error.message);
    throw error;
  }
}

import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
export const countWorkoutsThisWeek = async () => {
  try {
    const workoutsRef = collection(db, 'Workouts');
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Explicitly setting week to start on Monday
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
    const querySnapshot = await getDocs(query(workoutsRef, orderBy('timestamp')));

    let workoutCount = 0;

    querySnapshot.forEach(doc => {
      const workoutData = doc.data();
      const workoutTimestamp = new Date(workoutData.timestamp.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
      console.log(workoutData.timestamp.seconds * 1000); // Log the timestamp in milliseconds
      if (isWithinInterval(workoutTimestamp, { start: startOfWeekDate, end: endOfWeekDate })) {
        workoutCount++;
      }
    });
    console.log(workoutCount)
    return workoutCount;
  } catch (error) {
    console.error('Error counting workouts for this week:', error.message);
    throw error;
  }
};

export const getLastWorkout = async () => {
  try {
    const workoutsRef = collection(db, 'Workouts');
    const querySnapshot = await getDocs(query(workoutsRef, orderBy('timestamp', 'desc'), limit(1)));

    if (!querySnapshot.empty) {
      const lastWorkoutData = querySnapshot.docs[0].data();
      // You can format and process the data as needed before returning it
      console.log('last: ',lastWorkoutData);
      return lastWorkoutData;
    } else {
      // Return null or handle the case when there are no workouts available
      return null;
    }
  } catch (error) {
    console.error('Error fetching last workout:', error.message);
    throw error;
  }
};
