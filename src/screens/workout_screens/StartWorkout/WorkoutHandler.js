import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
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
    console.log(' dd',exerciseData);


    const hasEmptyOrInvalidInputs = exerciseData.some(exercise =>
      exercise.sets.some(set => {
        console.log('Type of weight:', typeof set.weight);
        console.log('Type of reps:', typeof set.reps);
        
        // Check if weight is undefined, null, or not a string
        const weightIsValid = set.weight !== undefined && set.weight !== null && (typeof set.weight === 'string' || typeof set.weight === 'number');
        
        // Check if reps is undefined, null, or not a string
        const repsIsValid = set.reps !== undefined && set.reps !== null && (typeof set.reps === 'string' || typeof set.reps === 'number');
    
        // Convert weight and reps to strings if they are numbers
        const weightString = typeof set.weight === 'number' ? String(set.weight) : set.weight;
        const repsString = typeof set.reps === 'number' ? String(set.reps) : set.reps;
    
        return (
          !weightIsValid || !repsIsValid || // Ensure weight and reps are defined and strings or numbers
          (weightIsValid && typeof weightString === 'string' && weightString.trim() === '') || // Ensure weight is not an empty string
          (repsIsValid && typeof repsString === 'string' && repsString.trim() === '') || // Ensure reps is not an empty string
          (weightIsValid && typeof weightString === 'string' && !/^\d+$/.test(weightString)) || // Ensure weight is a valid number
          (repsIsValid && typeof repsString === 'string' && !/^\d+$/.test(repsString)) // Ensure reps is a valid number
        );
      })
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
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }

    const uid = user.uid; // Get UID of the authenticated user
    const timestamp = new Date();
    const formattedTimestamp = `${timestamp.getFullYear()}_${(timestamp.getMonth() + 1)}_${timestamp.getDate()}_${timestamp.getHours()}_${timestamp.getMinutes()}_${uid}`;
    const workoutDataToSend = {
      uid: uid, // Store the user's ID in the workout document
      timestamp: timestamp,
      note: inputText,
      exercises: exerciseData.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          weight: typeof set.weight === 'string' ? parseFloat(set.weight.trim() !== '' ? set.weight : 0) : set.weight,
          reps: typeof set.reps === 'string' ? parseInt(set.reps.trim() !== '' ? set.reps : 0) : set.reps,
          isValidated: set.isValidated,
          estimated1RM: typeof set.reps === 'number' && set.reps > 0 ? 
            calculate1RM(typeof set.weight === 'number' ? set.weight : parseFloat(set.weight), 
            typeof set.reps === 'number' ? set.reps : parseInt(set.reps, 10)).toFixed(2) : 'N/A'
        }))
      })),
    };

    // Create a reference to the user's workout collection
    const userWorkoutsRef = collection(db, 'Workouts');
    const workoutDocRef = doc(userWorkoutsRef, formattedTimestamp); // Use formattedTimestamp

    await setDoc(workoutDocRef, workoutDataToSend);

    console.log(formattedTimestamp);

    navigation.navigate('WorkoutDetails', { 
      duration: formatTime(elapsedTime), 
      notes: inputText, 
      exercises: exerciseData,
      formattedTimestamp: formattedTimestamp, // Pass formattedTimestamp instead of timestamp
    });
  } catch (error) {
    console.error('Error finishing workout:', error.message);
    openAnimatedMessage(`Error: ${error.message}`);
  }
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

// Function to retrieve sets from the last workout for the current user
export const getSetsFromLastWorkout = async (exerciseName) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    const uid = user.uid;

    const workoutsRef = collection(db, 'Workouts');
    const querySnapshot = await getDocs(query(
      workoutsRef,
      where('uid', '==', uid) // Filter by UID
    ));

    for (const doc of querySnapshot.docs) {
      const workoutData = doc.data();
      // Extract the UID from the document ID
      const [, , , , , docUid] = doc.id.split('_'); // Assuming UID comes at the end
      if (docUid === uid) {
        const exercises = workoutData.exercises || [];
        const exercise = exercises.find(ex => ex.exerciseName === exerciseName);

        if (exercise) {
          const lastWorkoutSets = exercise.sets.map(set => `${set.weight} kg x ${set.reps}`);
          return lastWorkoutSets; // Directly return the sets array
        }
      }
    }
    return [];
  } catch (error) {
    console.error('Error retrieving sets from last workout:', error.message);
    throw error;
  }
}

// Function to count workouts for the current user within the current week
export const countWorkoutsThisWeek = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    const uid = user.uid;

    const workoutsRef = collection(db, 'Workouts');
    const querySnapshot = await getDocs(query(
      workoutsRef,
      where('uid', '==', uid) // Filter by UID
    ));

    // Now, you can iterate over the filtered documents and count the workouts as needed
    let workoutCount = 0;

    querySnapshot.forEach(doc => {
      // Extract the UID from the document ID
      const [, , , , , docUid] = doc.id.split('_'); // Assuming UID comes at the end
      if (docUid === uid) {
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
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    const uid = user.uid;

    const workoutsRef = collection(db, 'Workouts');
    const querySnapshot = await getDocs(query(
      workoutsRef,
      where('uid', '==', uid), // Filter by UID
      orderBy('timestamp', 'desc'), // Order by timestamp if needed
      limit(1)
    ));

    if (!querySnapshot.empty) {
      const lastWorkoutData = querySnapshot.docs[0].data();
      // You can format and process the data as needed before returning it
      console.log('last: ', lastWorkoutData);
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

