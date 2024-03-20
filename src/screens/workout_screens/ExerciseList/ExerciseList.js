import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import allExercises from '../../../exercises/exercises'
import exerciseListStyles from './ExerciseListStyles';

// ExerciseItem component
const ExerciseItem = ({ exercise, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(exercise.name)}>
      <View style={exerciseListStyles.exerciseContainer}>
        <Image source={exercise.image} style={exerciseListStyles.exerciseImage} />
        <Text style={exerciseListStyles.exerciseName}>{exercise.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ExerciseList component
const ExerciseList = ({ navigation }) => {
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    const sortedExerciseData = Object.entries(allExercises)
      .map(([muscleGroup, exercises]) => ({
        muscleGroup,
        exercises: exercises.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.muscleGroup.localeCompare(b.muscleGroup));

    setExerciseData(sortedExerciseData);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Exercise List',
    });
  }, [navigation]);

  const handleSelectedExercise = (exerciseName) => {
    console.log('Selected exercise:', exerciseName);
    navigation.goBack();
    navigation.navigate('StartWorkout', { selectedExercise: exerciseName });
  };

  return (
    <View style={exerciseListStyles.container}>
      <View style={exerciseListStyles.headerContainer}>
        <Text style={exerciseListStyles.headerTitle}>Choose Exercise</Text>
      </View>
      <FlatList
        data={exerciseData}
        renderItem={({ item }) => (
          <View style={exerciseListStyles.groupContainer}>
            <Text style={exerciseListStyles.groupTitle}>{item.muscleGroup}</Text>
            {item.exercises.map(exercise => (
              <ExerciseItem
                key={exercise.name}
                exercise={exercise}
                onSelect={handleSelectedExercise}
              />
            ))}
          </View>
        )}
        keyExtractor={(item) => item.muscleGroup}
        contentContainerStyle={exerciseListStyles.listContainer}
      />
    </View>
  );
};

export default ExerciseList;
