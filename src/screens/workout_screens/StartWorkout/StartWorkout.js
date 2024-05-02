import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  AppState,
  BackHandler,
  Alert,
} from 'react-native';
import { sendWorkoutDataToFirestore, handleAddExercises, handleValidation, handleInputChange, handleAddSet, handleWeightChange, handleRepsChange, getSetsFromLastWorkout } from './WorkoutHandler';
import styles from './StartWorkoutStyles';
import AnimatedMessage from '../../../helpers/AnimatedMessage';
import { Swipeable } from 'react-native-gesture-handler';

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
  const [lastWorkoutSets, setLastWorkoutSets] = useState([]); // State to store the sets from the last workout

  const intervalRef = useRef(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "YES", onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Optionally, handle the case where there is no previous screen to go back to
              Alert.alert("Alert", "No previous screen to go back to.");
            }
          }
        }
      ]);
      return true; // Prevent the default back action (exiting the app)
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation]); // Include navigation in the dependency array to ensure updated state

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        stopTimer();
      } else if (nextAppState === 'active') {
        startTimer();
      }
    });

    return () => {
      console.log('removing subscription');
      subscription.remove();
    };
  }, []);
  
  useEffect(() => {
    const fetchLastWorkoutSets = async () => {
      try {
        if (route.params?.selectedExercise) {
          const { selectedExercise } = route.params;
          const sets = await getSetsFromLastWorkout(selectedExercise);
          
          setExerciseData(prevData => {
            const updatedData = prevData.map(exercise => {
              if (exercise.exerciseName === selectedExercise) {
                return { ...exercise, lastWorkoutSets: sets };
              }
              return exercise;
            });
            return updatedData;
          });
        } else if (route.params?.selectedWorkout) {
          // Starting a workout from an existing one
          const { exercises } = route.params.selectedWorkout;
          const setsPromises = exercises.map(exercise => getSetsFromLastWorkout(exercise.exerciseName));
          const setsResults = await Promise.all(setsPromises);
          
          // Update lastWorkoutSets for all exercises
          setExerciseData(prevData => {
            return prevData.map((exercise, index) => {
              return { ...exercise, lastWorkoutSets: setsResults[index] };
            });
          });
        }
      } catch (error) {
        console.error('Error fetching last workout sets:', error.message);
      }
    };
  
    fetchLastWorkoutSets();
  }, [route.params?.selectedExercise, route.params?.selectedWorkout]);
  
  useEffect(() => {
    navigation.setParams({ selectedExercise: selectedExercise });
  }, [selectedExercise]);
  
  useEffect(() => {
    if (route.params?.selectedExercise) {
      const newExerciseName = route.params.selectedExercise;
      const isExerciseAlreadyAdded = exerciseData.some(exercise => exercise.exerciseName === newExerciseName);
      if (!isExerciseAlreadyAdded) {
        const newExercise = {
          exerciseName: newExerciseName,
          sets: [{ weight: '', reps: '', isValidated: false }],
          lastWorkoutSets: [], // Initialize last workout sets array for the new exercise
        };
        setExerciseData(prevData => [...prevData, newExercise]);
        setSelectedExercise(newExerciseName);
      }
    }
  }, [route.params?.selectedExercise]);
  
  
  useEffect(() => {
    if (route.params?.selectedWorkout) {
      const { note, exercises } = route.params.selectedWorkout;
      setInputText(note);
      setExerciseData(exercises.map(exercise => ({
        ...exercise,
        lastWorkoutSets: Array(exercise.sets.length).fill(''), // Initialize with empty strings
      })));
      const firstExerciseName = exercises[0]?.exerciseName || null;
      setSelectedExercise(firstExerciseName);

      let anySetNotValidated = false;
      exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (!set.isValidated) {
            anySetNotValidated = true;
            return;
          }
        });
      });
      setIsValidationPressed(!anySetNotValidated);
    } else {
      setIsValidationPressed(false);
    }
  }, [route.params?.selectedWorkout]);

  const handleExit = () => {
    // Open a modal to confirm exit
    openModal('Are you sure you want to exit the workout?', confirmExit);
  };

  const confirmExit = () => {
    // Perform the actual exit logic here
    stopTimer();
    setElapsedTime(0); // Assuming 'elapsedTime' is controlled by a setInterval
    navigation.goBack(); // This will navigate the user back to the previous screen
  };
  
  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds; // Ensure leading zero if seconds < 10
    return `${minutes}:${formattedSeconds}`;
  };
  
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const threshold = 100; // Adjust this threshold as needed
    
    if (offsetY + scrollViewHeight >= contentHeight - threshold) {
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
      stopTimer();
      setElapsedTime(0);
      await sendWorkoutDataToFirestore(
        exerciseData,
        inputText,
        isValidationPressed,
        navigation,
        openAnimatedMessage,
        openModal,
        formatTime,
        elapsedTime,
      );
    } catch (error) {
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
          openModal={openModal}
          openAnimatedMessage={openAnimatedMessage}
          lastWorkoutSets={lastWorkoutSets} // Pass lastWorkoutSets as a prop            // Pass openModal as a prop
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
  openAnimatedMessage,
  handleSwipeDelete,
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
        <Text style={styles.label}>
            {exercise.lastWorkoutSets.length > setIndex
              ? exercise.lastWorkoutSets[setIndex] || 'No previous sets'
              : 'No previous sets'}
          </Text>
          <TextInput
            style={styles.inputField}
            placeholder="Weight" 
            value={String(data.weight)} // Convert weight to string
            onChangeText={(text) =>
              handleWeightChange(
                text,
                exerciseIndex,
                setIndex,
                exerciseData,
                setExerciseData,
                openAnimatedMessage
              )
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Reps"
            value={String(data.reps)} // Convert reps to string
            onChangeText={(text) =>
              handleRepsChange(
                text,
                exerciseIndex,
                setIndex,
                exerciseData,
                setExerciseData,
                openAnimatedMessage
              )
            }
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              styles.validationButton,
              { backgroundColor: data.isValidated ? '#008080' : '#808080' },
            ]}
            onPress={() =>
              handleValidation(
                exerciseIndex,
                setIndex,
                exerciseData,
                setExerciseData,
                setIsValidationPressed
              )
            }
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