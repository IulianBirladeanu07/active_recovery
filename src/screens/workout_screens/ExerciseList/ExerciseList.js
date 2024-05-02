import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import allExercises from '../../../exercises/exercises';
import exerciseListStyles from './ExerciseListStyles';
import { useNavigation } from '@react-navigation/native';
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

const ExerciseList = ({ route }) => {
  const navigation = useNavigation();
  const [exerciseData, setExerciseData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExerciseData, setFilteredExerciseData] = useState([]);

  useEffect(() => {
    const sortedExerciseData = Object.entries(allExercises)
      .map(([muscleGroup, exercises]) => ({
        muscleGroup,
        exercises: exercises.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.muscleGroup.localeCompare(b.muscleGroup));

    setExerciseData(sortedExerciseData);
    setFilteredExerciseData(sortedExerciseData);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExerciseData(exerciseData);
    } else {
      const matchedExercises = exerciseData.map(group => ({
        ...group,
        exercises: group.exercises.filter(exercise =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(group => group.exercises.length > 0);

      setFilteredExerciseData(matchedExercises);
    }
  }, [searchQuery, exerciseData]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Exercise List',
    });
  }, [navigation]);

  const handleSelectedExercise = (exerciseName) => {
    console.log('Selected exercise:', exerciseName);
    const previousScreen = route.params ? route.params.previousScreen : null;

    if (previousScreen === 'StartWorkout') {
      navigation.navigate('StartWorkout', { selectedExercise: exerciseName });
    } else {
      navigation.navigate('CreateTemplate', { selectedExercise: exerciseName });
    }
  };

  return (
    <View style={exerciseListStyles.container}>
      <View style={exerciseListStyles.headerContainer}>
        <Text style={exerciseListStyles.headerTitle}>Choose Exercise</Text>
        <View style={exerciseListStyles.searchContainer}>
          <TextInput
            style={exerciseListStyles.searchInput}
            placeholder="Search Exercises"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
      <FlatList
        data={filteredExerciseData}
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
