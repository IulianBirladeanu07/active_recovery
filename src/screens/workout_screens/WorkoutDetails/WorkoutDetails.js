import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { calculate1RM } from '../../workout_screens/StartWorkout/WorkoutHandler';
import { db, collection, getDocs } from '../../../services/firebase';
import WorkoutSummary from '../WorkoutDetails/WorkoutSummary';

const WorkoutDetails = ({ route }) => {
  const { duration, notes, exercises, formattedTimestamp, sessionTitle, date } = route.params;
  const [totalPRs, setTotalPRs] = useState(0); 

  useEffect(() => {
    const countTotalPRs = async () => {
      let total = 0;
  
      const querySnapshot = await getDocs(collection(db, 'Workouts'));

      exercises.forEach(exercise => {
        const exerciseName = exercise.exerciseName;
        const currentExerciseSets = exercise.sets;

        const matchingExerciseDoc = querySnapshot.docs.find(doc => {
          const data = doc.data();
          return data.exercises.some(ex => ex.exerciseName === exerciseName);
        });

        if (matchingExerciseDoc) {
          const matchingExercise = matchingExerciseDoc.data().exercises.find(ex => ex.exerciseName === exerciseName);
          const sets = matchingExercise.sets;
          const bestSet = findBestSet(sets);
          const prev1RM = parseFloat(bestSet.estimated1RM).toFixed(2) || 0;

          const bestCurrentSet = findBestSet(currentExerciseSets);
          const current1RM = calculate1RM(parseFloat(bestCurrentSet.weight), parseInt(bestCurrentSet.reps, 10)).toFixed(2);

          if (parseFloat(current1RM) > prev1RM) {
            total++;
          }
        }
      });
      setTotalPRs(total);
    };
  
    countTotalPRs();
  }, [exercises]);
  
  const findBestSet = (sets) => {
    return sets.reduce((best, set) => {
      const current1RM = calculate1RM(parseFloat(set.weight), parseInt(set.reps, 10));
      return current1RM > best.estimated1RM ? { ...set, estimated1RM: current1RM } : best;
    }, { estimated1RM: 0 });
  };

  return (
    <WorkoutSummary
      formattedTimestamp={formattedTimestamp}
      duration={duration}
      totalPRs={totalPRs}
      exercises={exercises}
    />
  );
};

export default WorkoutDetails;
