import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  AppState,
} from 'react-native';
import { format } from 'date-fns';
import { sendWorkoutDataToFirestore, handleAddExercises, handleValidation, handleInputChange, handleAddSet, handleWeightChange, handleRepsChange } from './WorkoutHandler';
import styles from './StartWorkoutStyles';
import AnimatedMessage from '../../../helpers/AnimatedMessage';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartWorkout = ({ route, navigation }) => {
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isValidationPressed, setIsValidationPressed] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

  const [animatedMessage, setAnimatedMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(() => {});

  // Effect for handling AppState changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState === 'active' && (nextAppState.match(/inactive|background/))) {
        // When app goes to the background, save the current timestamp and elapsed time
        setStartTime(Date.now() - elapsedTime * 1000); // Adjust startTime based on elapsed time
      } else if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // When app comes to the foreground, update elapsed time
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, elapsedTime, startTime]);

  // Effect for updating the timer every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    navigation.setParams({ selectedExercise: selectedExercise });
  }, [selectedExercise]);
  

  useEffect(() => {
    if (route.params?.selectedExercise) {
      const newExercise = {
        exerciseName: route.params.selectedExercise,
        sets: [{ weight: '', reps: '', isValidated: false }],
      };
      setExerciseData((prevData) => [...prevData, newExercise]);
      setSelectedExercise(newExercise.exerciseName);
      console.log('Selected exercise from route parameters:', newExercise.exerciseName);
    }
  }, [route.params?.selectedExercise]);

  useEffect(() => {
    if (route.params?.selectedWorkout) {
      const { note, exercises } = route.params.selectedWorkout;
      setInputText(note);
      setExerciseData(exercises);
      const firstExerciseName = exercises[0]?.exerciseName || null;
      setSelectedExercise(firstExerciseName);
      console.log('Selected exercise from loaded workout data:', firstExerciseName);
    }
  }, [route.params?.selectedWorkout]);

  const handleExit = () => {
    clearInterval(elapsedTime);
    navigation.goBack();
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight) {
      setShowFinishButton(true);
    } else {
      setShowFinishButton(false);
    }
  };

  const openAnimatedMessage = (message) => {
    setAnimatedMessage(message);
    setTimeout(() => setAnimatedMessage(''), 3000);
  };

  const openModal = (message, callback) => {
    setModalMessage(message);
    setIsModalVisible(true);
    setModalCallback(() => callback);
  };

  const handleModalConfirm = () => {
    modalCallback();
    closeModal();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalCallback(() => {}); // Reset the callback
  };

  const handleFinishWorkout = async () => {
    try {
      await sendWorkoutDataToFirestore(
        exerciseData,
        inputText,
        isValidationPressed,
        navigation,
        openAnimatedMessage,
        openModal,
      );
    } catch (error) {
      console.error('Error finishing workout:', error.message);
      openModal('Error', () => console.log(error.message)); // Adjust to handle error
    }
  };

  const renderSetInputs = () => {
    // console.log(selectedExercise);
    if (selectedExercise) {
      return exerciseData.map((exercise, exerciseIndex) => (
        <ExerciseInput
          key={exerciseIndex}
          exercise={exercise}
          exerciseIndex={exerciseIndex}
          handleWeightChange={handleWeightChange}
          handleRepsChange={handleRepsChange}
          handleValidation={handleValidation}
          setIsValidationPressed={setIsValidationPressed}
          setExerciseData={setExerciseData}
          exerciseData={exerciseData}
          openModal={openModal} // Pass openModal as a prop
          handleSwipeDelete={handleSwipeDelete} // Pass handleSwipeDelete as a prop
        />
      ));
    }
    return null;
  };

  const handleSwipeDelete = (exerciseIndex, setIndex) => {
    if (exerciseData[exerciseIndex].sets.length > 1) {
      // If more than one set, delete the specific set
      const updatedSets = [...exerciseData[exerciseIndex].sets];
      updatedSets.splice(setIndex, 1);
      const updatedExerciseData = [...exerciseData];
      updatedExerciseData[exerciseIndex].sets = updatedSets;
      setExerciseData(updatedExerciseData);
      console.log('Updated exercise data after deleting a set:', updatedExerciseData);
    } else {
      // If only one set, show the modal for confirmation
      openModal('Are you sure you want to delete this exercise?', () => {
        // Delete the entire exercise only after confirming in the modal
        const updatedExerciseData = [...exerciseData];
        updatedExerciseData.splice(exerciseIndex, 1);
        const remainingExercises = updatedExerciseData.map(exercise => exercise.exerciseName);
        const newSelectedExercise = remainingExercises.length > 0 ? remainingExercises[0] : null;
        console.log('New selected exercise:', newSelectedExercise); // Log the new selected exercise
        setSelectedExercise(newSelectedExercise);
        setExerciseData(updatedExerciseData);
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <Modal transparent visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalButtonClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModalConfirm} style={styles.modalButtonFinish}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.headerContainer}>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setIsAtBottom(false);
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Note"
          value={inputText}
          onChangeText={text => handleInputChange(text, setInputText)}
        />
        {renderSetInputs()}
        <TouchableOpacity
          style={styles.addExercisesButton}
          onPress={() => handleAddExercises(navigation)}
        >
          <Text style={styles.addExercisesButtonText}>Add Exercises</Text>
        </TouchableOpacity>
      </ScrollView>
      {showFinishButton && (
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishWorkout}
        >
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      )}
      {/* Conditional rendering of the AnimatedMessage */}
      {animatedMessage ? <AnimatedMessage message={animatedMessage} /> : null}
    </View>
  );
};

const ExerciseInput = ({
  exercise,
  exerciseIndex,
  handleWeightChange,
  handleRepsChange,
  handleValidation,
  setIsValidationPressed,
  setExerciseData,
  exerciseData,
  openModal,
  handleSwipeDelete, // Receive handleSwipeDelete as a prop
}) => (
  <View style={styles.exerciseContainer}>
    <Text style={styles.selectedExerciseName}>{exercise.exerciseName}</Text>
    {exercise.sets.map((data, setIndex) => (
      // Wrap each set with Swipeable component
      <Swipeable
        key={setIndex}
        containerStyle={styles.swipeableContainer}
        renderRightActions={(_, dragX) => (
          <Animated.View
            style={[
              styles.deleteButton,
              {
                transform: [
                  {
                    translateX: dragX.interpolate({
                      inputRange: [-100, 0],
                      outputRange: [0, 100],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
          </Animated.View>
        )}
        onSwipeableWillOpen={() => handleSwipeDelete(exerciseIndex, setIndex)}
      >
        <View style={styles.inputContainer} key={setIndex}>
          <TextInput
            style={styles.inputField}
            placeholder="Weight"
            value={data.weight}
            onChangeText={text => handleWeightChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData, openModal)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Reps"
            value={data.reps}
            onChangeText={text => handleRepsChange(text, exerciseIndex, setIndex, exerciseData, setExerciseData, openModal)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              styles.validationButton,
              { backgroundColor: data.isValidated ? '#008080' : '#808080' },
            ]}
            onPress={() => handleValidation(exerciseIndex, setIndex, exerciseData, setExerciseData, setIsValidationPressed)}
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

export default StartWorkout;