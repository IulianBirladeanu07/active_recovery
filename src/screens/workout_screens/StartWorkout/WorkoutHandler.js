import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, setDoc, getDocs, getDoc, deleteDoc, doc, query, where, orderBy, limit, FieldValue } from '../../../services/firebase';

export const sendWorkoutDataToFirestore = async (
  exerciseData,
  inputText,
  isValidationPressed,
  navigation,
  openAnimatedMessage,
  openModal,
  formatTime,
  elapsedTime,
) => {
  try {
    const hasEmptyOrInvalidInputs = exerciseData.some(exercise =>
      exercise.sets.some(set => {
        const weightIsValid = set.weight !== undefined && set.weight !== null && (typeof set.weight === 'string' || typeof set.weight === 'number');
        const repsIsValid = set.reps !== undefined && set.reps !== null && (typeof set.reps === 'string' || typeof set.reps === 'number');
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
    const workoutDocRef = doc(userWorkoutsRef, formattedTimestamp);

    await setDoc(workoutDocRef, workoutDataToSend);
    navigation.replace('WorkoutDetails', { 
      duration: formatTime(elapsedTime), 
      notes: inputText, 
      exercises: exerciseData,
      timestamp:workoutDataToSend.timestamp.toDateString() + " " + workoutDataToSend.timestamp.toLocaleTimeString(),
    });
  } catch (error) {
    console.error('Error finishing workout:', error.message);
    openAnimatedMessage(`Error: ${error.message}`);
  }
}


export const calculate1RM = (weight, reps) => {
  return weight / (1.0278 - 0.0278 * reps);
};

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

export const findBestSet = (sets) => {
    return sets.reduce((best, set) => {
      const current1RM = calculate1RM(parseFloat(set.weight), parseInt(set.reps, 10));
      return current1RM > best.estimated1RM ? { ...set, estimated1RM: current1RM } : best;
    }, { estimated1RM: 0 });
  };


export const handleAddExercises = (navigation) => {
  navigation.navigate('ExerciseList', { previousScreen: 'StartWorkout' });
};

export const handleValidation = (exerciseIndex, setIndex, exerciseData, setExerciseData, setIsValidationPressed) => {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].isValidated = !updatedData[exerciseIndex].sets[setIndex].isValidated;
    setExerciseData(updatedData);

    const allSetsValidated = updatedData.every(exercise =>
      exercise.sets.every(set => set.isValidated)
    );  
    setIsValidationPressed(allSetsValidated);
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

export const handleWeightChange = (text, exerciseIndex, setIndex, exerciseData, setExerciseData, openAnimatedMessage) => {
  if (text === '' || /^\d+$/.test(text)) {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].weight = text;
    setExerciseData(updatedData);
  } else {
    openAnimatedMessage('Error', 'Please enter a valid positive integer for weight.');
  }
};

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
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const workoutsRef = collection(db, 'Workouts');
    const querySnapshot = await getDocs(query(
      workoutsRef,
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(50)  // Fetch only the most recent workout document
    ));

    if (!querySnapshot.empty) {
      const workoutData = querySnapshot.docs[0].data();
      const exercises = workoutData.exercises || [];
      const exercise = exercises.find(ex => ex.exerciseName === exerciseName);
      if (exercise) {
        return exercise.sets.map(set => `${set.weight} kg x ${set.reps}`);
      }
    }
    return [];
  } catch (error) {
    console.error('Error retrieving sets from last workout:', error.message);
    throw error;
  }
}


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
    let workoutCount = 0;

    querySnapshot.forEach(doc => {
      // Extract the UID from the document ID
      const [, , , , , docUid] = doc.id.split('_');
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

      return lastWorkoutData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching last workout:', error.message);
    throw error;
  }
};

export const addTemplateToFirestore = async (templateData, templateName) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const formattedTemplateName = `${templateName}_${user.uid}`;

    const fullTemplateData = {
      ...templateData,
      uid: user.uid
    };

    const templateDocRef = doc(db, 'Templates', formattedTemplateName);

    await setDoc(templateDocRef, fullTemplateData);
    console.log('Template created with name:', formattedTemplateName, fullTemplateData);
  } catch (error) {
    console.error('Error adding template data to Firestore:', error.message);
    throw error;
  }
};

export const fetchTemplatesFromFirestore = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }

    const templatesCollectionRef = collection(db, 'Templates');
    const q = query(templatesCollectionRef, where("uid", "==", user.uid));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No templates found for user:', user.uid);
      return [];
    }

    const templates = querySnapshot.docs.map(doc => ({
      data: doc.data()
    }));
    console.log('Templates retrieved for user:', templates);
    return templates;
  } catch (error) {
    console.error('Error retrieving user templates from Firestore:', error.message);
    throw error;
  }
};

export const deleteTemplateFromFirestore = async (templateName) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }

    const formattedTemplateName = `${templateName}_${user.uid}`;

    const templateDocRef = await getDocs(collection(db, 'Templates'));
    const templateToDelete = templateDocRef.docs.find(doc => doc.id === formattedTemplateName);

    if (templateToDelete) {
      await deleteDoc(templateToDelete.ref);
      console.log('Template deleted:', formattedTemplateName);
    } else {
      console.error('Template not found:', formattedTemplateName);
    }
  } catch (error) {
    console.error('Error deleting template from Firestore:', error.message);
    throw error;
  }
};

export const sendMeasurementsToFirestore = async (measurements) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }

    const uid = user.uid;
    const timestamp = new Date();
    const formattedTimestamp = `${timestamp.getFullYear()}_${(timestamp.getMonth() + 1)}_${timestamp.getDate()}_${timestamp.getHours()}_${timestamp.getMinutes()}_${uid}`;

    const measurementsDataToSend = {
      ...measurements,
      uid: uid,
      timestamp: timestamp,
    };

    // Create a reference to the user's measurements collection
    const userMeasurementsRef = collection(db, 'measurements');
    const measurementDocRef = doc(userMeasurementsRef, formattedTimestamp);

    await setDoc(measurementDocRef, measurementsDataToSend);
    console.log('Measurements saved:', measurementsDataToSend);
  } catch (error) {
    console.error('Error saving measurements:', error.message);
    throw error;
  }
};

export const fetchLastMeasurements = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }

    const uid = user.uid;

    const measurementsRef = collection(db, 'measurements');
    const q = query(measurementsRef, where('uid', '==', uid), orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching last measurements:', error.message);
    throw error;
  }
};