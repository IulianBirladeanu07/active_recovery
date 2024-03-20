// StartWorkout.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Animated } from 'react-native';
import { format } from 'date-fns';
import { db, doc, setDoc, collection } from '../../../services/firebase';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ExerciseItem from '../ExerciseItem/ExerciseItem';
import ModalComponent from './Modal';
import { startWorkoutStyles } from './StartWorkoutStyles';

const StartWorkout = ({ route, navigation }) => {
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isValidationPressed, setIsValidationPressed] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isEmptyFlagEnabled, setIsFlagEnabled] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (route.params?.selectedExercise) {
      const newExercise = {
        exerciseName: route.params.selectedExercise,
        sets: [{ weight: '', reps: '', isValidated: false }],
      };
      setExerciseData((prevData) => [...prevData, newExercise]);
      setSelectedExercise(newExercise.exerciseName);
    }
  }, [route.params?.selectedExercise]);

  useEffect(() => {
    if (route.params?.selectedWorkout) {
      const { note, exercises } = route.params.selectedWorkout;
      setInputText(note);
      setExerciseData(exercises);
      setSelectedExercise(exercises[0]?.exerciseName || null);
    }
  }, [route.params?.selectedWorkout]);

  const handleExit = () => {
    clearInterval(intervalId);
    navigation.goBack();
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight) {
      setShowFinishButton(true);
    } else {
      setShowFinishButton(false);
    }
  };

  const sendWorkoutDataToFirestore = async () => {
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

      if (hasEmptyOrInvalidInputs && !isEmptyFlagEnabled) {
        openModal(
          'Some sets or reps are not filled, are you sure you want to finish the workout?'
        );
        setIsFlagEnabled(true);
      } else if (!isValidationPressed) {
        openModal(
          'Some sets are not validated, please validate them before you decide to finish the workout'
        );
      } else {
        const workoutDataToSend = {
          timestamp: new Date(),
          note: inputText,
          exercises: exerciseData,
        };

        const formattedTimestamp = format(
          workoutDataToSend.timestamp,
          'EEEE, MMMM d, yyyy h:mm a'
        );

        const workoutDocRef = doc(collection(db, 'Workouts'), formattedTimestamp);

        await setDoc(workoutDocRef, workoutDataToSend);
        console.log(isValidationPressed);
        console.log('Workout data added to Firestore!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding workout data:', error.message);
      openModal(error.message);
    }
  };

  const handleAddExercises = () => {
    navigation.navigate('ExerciseList');
  };

  const handleValidation = (exerciseIndex, setIndex) => {
    const updatedData = [...exerciseData];
    updatedData[exerciseIndex].sets[setIndex].isValidated = !updatedData[exerciseIndex].sets[setIndex].isValidated;
    setExerciseData(updatedData);

    const allSetsValidated = updatedData[exerciseIndex].sets.every(
      (set) => set.isValidated
    );

    setIsValidationPressed(allSetsValidated);
  };

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedData = [...exerciseData];
    const newSet = { weight: '', reps: '', isValidated: false };
    updatedData[exerciseIndex].sets.push(newSet);
    setExerciseData(updatedData);
  };

  const handleWeightChange = (text, exerciseIndex, setIndex) => {
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

  const handleRepsChange = (text, exerciseIndex, setIndex) => {
    if (/^\d+$/.test(text)) {
      const updatedData = [...exerciseData];
      updatedData[exerciseIndex].sets[setIndex].reps = text;
      setExerciseData(updatedData);
    } else {
      Alert.alert('Error', 'Please enter a valid positive integer for reps.');
    }
  };

  const handleDeleteExercise = (exerciseIndex) => {
    const updatedData = [...exerciseData];
    updatedData.splice(exerciseIndex, 1);
    setExerciseData(updatedData);
  };

  const renderSetInputs = () => {
    if (selectedExercise) {
      return exerciseData.map((exercise, exerciseIndex) => (
        <ExerciseItem
          key={exerciseIndex}
          exercise={exercise}
          handleDeleteExercise={handleDeleteExercise}
          handleValidation={handleValidation}
          handleWeightChange={handleWeightChange}
          handleRepsChange={handleRepsChange}
          handleAddSet={handleAddSet}
        />
      ));
    }
    return null;
  };

  return (
    <GestureHandlerRootView style={startWorkoutStyles.container}>
    <ModalComponent
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      modalMessage={modalMessage}
      sendWorkoutDataToFirestore={sendWorkoutDataToFirestore}
    />
    <View style={startWorkoutStyles.headerContainer}>
      <Text style={startWorkoutStyles.timerText}>{formatTime(seconds)}</Text>
      <TouchableOpacity style={startWorkoutStyles.exitButton} onPress={handleExit}>
        <Text style={startWorkoutStyles.exitButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      contentContainerStyle={startWorkoutStyles.scrollViewContent}
      onScroll={handleScroll}
      onContentSizeChange={(contentWidth, contentHeight) => {
        setIsAtBottom(false);
      }}
    >
      <TextInput
        style={startWorkoutStyles.input}
        placeholder="Note"
        value={inputText}
        onChangeText={handleInputChange}
      />
      {renderSetInputs()}
      <TouchableOpacity
        style={startWorkoutStyles.addExercisesButton}
        onPress={handleAddExercises}
      >
        <Text style={startWorkoutStyles.addExercisesButtonText}>Add Exercises</Text>
      </TouchableOpacity>
    </ScrollView>
    {showFinishButton && (
      <TouchableOpacity
        style={startWorkoutStyles.finishButton}
        onPress={sendWorkoutDataToFirestore}
      >
        <Text style={startWorkoutStyles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    )}
  </GestureHandlerRootView>
);
};

export default StartWorkout;

