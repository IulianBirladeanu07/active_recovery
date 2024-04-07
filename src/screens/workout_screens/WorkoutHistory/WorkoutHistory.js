  import React, { useState, useEffect, useCallback } from 'react';
  import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
  import { collection, getDocs, db } from '../../../services/firebase';
  import { format } from 'date-fns';

  const HistoryScreen = ({ navigation }) => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
      const fetchWorkouts = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Workouts'));
          const workoutList = [];
          querySnapshot.forEach((doc) => {
            const workoutData = doc.data();
            workoutList.push(workoutData);
          });
          workoutList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
          setWorkouts(workoutList);
        } catch (error) {
          console.error('Error fetching workouts:', error);
          // Add error handling here
        }
      };

      fetchWorkouts();
    }, []);

    const formatTimestamp = (timestamp) => {
      return format(timestamp.toDate(), "d 'of' MMMM, yyyy ',' HH:mm ");
    };

    const handleWorkoutPress = useCallback((workout) => {
      if (workout) {
        const formattedWorkoutData = {
          note: workout.note,
          exercises: workout.exercises.map((exercise) => ({
            exerciseName: exercise.exerciseName,
            sets: exercise.sets.map((set) => {
              // Log the isValidated property
              console.log('isValidated:', set.isValidated);
              return {
                weight: set.weight.toString(),
                reps: set.reps.toString(),
                isValidated: set.isValidated,
              };
            }),
          })),
        };
        navigation.navigate('StartWorkout', { selectedWorkout: formattedWorkoutData });
      } else {
        console.error('Invalid workout data:', workout);
      }
    }, [navigation]);
    
    const renderExercise = useCallback((exercise, exerciseIndex) => (
      <View style={styles.exerciseContainer} key={`${exercise.exerciseName}-${exerciseIndex}`}>
        <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        {exercise.sets.map((set, setIndex) => (
          <View style={styles.setContainer} key={setIndex}>
            <Text style={styles.setDetails}>
              Weight: {set.weight} Reps: {set.reps}
            </Text>
          </View>
        ))}
      </View>
    ), []);

    const renderItem = useCallback(({ item }) => (
      <TouchableOpacity
        style={styles.workoutContainer}
        onPress={() => handleWorkoutPress(item)}
      >
        <Text style={styles.timestamp}>
          {formatTimestamp(item.timestamp)}
        </Text>
        <Text style={styles.note}>{item.note}</Text>
        {item.exercises.map(renderExercise)}
      </TouchableOpacity>
    ), [handleWorkoutPress, renderExercise]);

    return (
      <View style={styles.container}>
        <FlatList
          data={workouts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding:5,
      flex: 1,
      backgroundColor: '#02111B',
    },
    workoutContainer: {
      backgroundColor: '#02111B',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      marginTop: 10,
      borderWidth: 0.5,
      borderColor: '#000000',
    },
    timestamp: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 5,
    },
    note: {
      fontSize: 14,
      color: '#FFFFFF',
      marginBottom: 10,
    },
    exerciseContainer: {
      marginBottom: 5,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 3,
    },
    setContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    setDetails: {
      fontSize: 14,
      color: '#FFFFFF',
    },
  });

  export default HistoryScreen;
