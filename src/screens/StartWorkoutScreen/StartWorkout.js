import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Animated, AppState, BackHandler, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import styles from './StartWorkoutStyles';
import AnimatedMessage from '../../components/AnimatedMessage/AnimatedMessage';
import { sendWorkoutDataToFirestore,
         handleAddExercises,
         handleValidation,
         handleInputChange,
         handleAddSet,
         handleWeightChange,
         handleRepsChange,
         getSetsFromLastWorkout } from '../../handlers/WorkoutHandler';
import { WorkoutContext } from '../../context/WorkoutContext';

const StartWorkout = ({ route, navigation }) => {
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isValidationPressed, setIsValidationPressed] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [animatedMessage, setAnimatedMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(() => {});
  const [lastWorkoutSets, setLastWorkoutSets] = useState([]);

  const { refreshAllData } = useContext(WorkoutContext);
  const intervalRef = useRef(null);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    return () => appStateSubscription.remove();
  }, []);

  useEffect(() => {
    fetchLastWorkoutSets();
  }, [route.params?.selectedExercise, route.params?.selectedWorkout]);

  useEffect(() => {
    navigation.setParams({ selectedExercise });
  }, [selectedExercise]);

  useEffect(() => {
    if (route.params?.selectedExercise) {
      addNewExercise(route.params.selectedExercise);
    }
  }, [route.params?.selectedExercise]);

  useEffect(() => {
    if (route.params?.selectedWorkout) {
      handleSelectedWorkout(route.params.selectedWorkout);
    }
  }, [route.params?.selectedWorkout]);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const handleBackPress = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "YES",
        onPress: () => navigation.goBack()
      }
    ]);
    return true;
  };

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      stopTimer();
    } else if (nextAppState === 'active') {
      startTimer();
    }
  };

  const fetchLastWorkoutSets = async () => {
    try {
      if (route.params?.selectedExercise) {
        const { selectedExercise } = route.params;
        const sets = await getSetsFromLastWorkout(selectedExercise);
        updateExerciseData(selectedExercise, sets);
      } else if (route.params?.selectedWorkout) {
        const { exercises } = route.params.selectedWorkout;
        const setsPromises = exercises.map(exercise => getSetsFromLastWorkout(exercise.exerciseName));
        const setsResults = await Promise.all(setsPromises);
        exercises.forEach((exercise, index) => {
          updateExerciseData(exercise.exerciseName, setsResults[index]);
        });
      }
    } catch (error) {
      console.error('Error fetching last workout sets:', error.message);
    }
  };

  const updateExerciseData = (exerciseName, sets) => {
    setExerciseData(prevData => {
      return prevData.map(exercise => {
        if (exercise.exerciseName === exerciseName) {
          return { ...exercise, lastWorkoutSets: sets };
        }
        return exercise;
      });
    });
  };

  const addNewExercise = (exerciseName) => {
    const isExerciseAlreadyAdded = exerciseData.some(exercise => exercise.exerciseName === exerciseName);
    if (!isExerciseAlreadyAdded) {
      const newExercise = {
        exerciseName: exerciseName,
        sets: [{ weight: '', reps: '', isValidated: false }],
        lastWorkoutSets: [],
      };
      setExerciseData(prevData => [...prevData, newExercise]);
      setSelectedExercise(exerciseName);
    }
  };

  const handleSelectedWorkout = ({ note, exercises }) => {
    setInputText(note);
    setExerciseData(exercises.map(exercise => ({
      ...exercise,
      lastWorkoutSets: Array(exercise.sets.length).fill(''),
    })));
    const firstExerciseName = exercises[0]?.exerciseName || null;
    setSelectedExercise(firstExerciseName);
    const anySetNotValidated = exercises.some(exercise => exercise.sets.some(set => !set.isValidated));
    setIsValidationPressed(!anySetNotValidated);
  };

  const handleExit = () => {
    openModal('Are you sure you want to exit the workout?', confirmExit);
  };

  const confirmExit = () => {
    stopTimer();
    setElapsedTime(0);
    navigation.goBack();
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const handleScroll = event => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const { y } = contentOffset;
    const { height } = contentSize;
    const { height: windowHeight } = layoutMeasurement;
    const threshold = 100;

    if (y + windowHeight >= height - threshold) {
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
    setModalCallback(() => {});
  };

  const handleFinishWorkout = async () => {
    try {
      stopTimer();
      setElapsedTime(0);
      refreshAllData();
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
      openModal('Error', () => console.log(error.message));
    }
  };

  const renderSetInputs = () => {
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
          lastWorkoutSets={lastWorkoutSets}
          handleSwipeDelete={handleSwipeDelete}
        />
      ));
    }
    return null;
  };

  const handleSwipeDelete = (exerciseIndex, setIndex) => {
    if (exerciseData[exerciseIndex].sets.length > 1) {
      const updatedSets = [...exerciseData[exerciseIndex].sets];
      updatedSets.splice(setIndex, 1);
      const updatedExerciseData = [...exerciseData];
      updatedExerciseData[exerciseIndex].sets = updatedSets;
      setExerciseData(updatedExerciseData);
    } else {
      openModal('Are you sure you want to delete this exercise?', () => {
        const updatedExerciseData = [...exerciseData];
        updatedExerciseData.splice(exerciseIndex, 1);
        const remainingExercises = updatedExerciseData.map(exercise => exercise.exerciseName);
        const newSelectedExercise = remainingExercises.length > 0 ? remainingExercises[0] : null;
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
        onContentSizeChange={(contentWidth, contentHeight) => setIsAtBottom(false)}
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
      {animatedMessage ? <AnimatedMessage message={animatedMessage} /> : null}
    </View>
  );
};

const ExerciseInput = ({ exercise, exerciseIndex, handleWeightChange, handleRepsChange, handleValidation, setIsValidationPressed, setExerciseData, exerciseData, openAnimatedMessage, handleSwipeDelete }) => {
  const fadeAnim = useRef(exercise.sets.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = fadeAnim.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, [exercise.sets.length]);

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.selectedExerciseName}>{exercise.exerciseName}</Text>
      {exercise.sets.map((data, setIndex) => (
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
            />
          )}
          onSwipeableWillOpen={() => handleSwipeDelete(exerciseIndex, setIndex)}
        >
          <Animated.View
            style={{ opacity: fadeAnim[setIndex] }}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {exercise.lastWorkoutSets.length > setIndex
                  ? exercise.lastWorkoutSets[setIndex] || 'No previous sets'
                  : 'No previous sets'}
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder="Weight"
                value={String(data.weight)}
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
                value={String(data.reps)}
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
          </Animated.View>
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
};

export default StartWorkout;
