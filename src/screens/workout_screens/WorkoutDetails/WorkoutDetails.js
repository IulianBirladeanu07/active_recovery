import React, { useEffect, useState } from 'react';
import { StyleSheet, BackHandler, View, Alert } from 'react-native'; 
import { useNavigation } from '@react-navigation/native'; 
import { calculate1RM } from '../../workout_screens/StartWorkout/WorkoutHandler';
import { db, collection, getDocs } from '../../../services/firebase';
import WorkoutSummary from '../WorkoutDetails/WorkoutSummary';

const WorkoutDetails = ({ route }) => {
  const navigation = useNavigation();
  const { duration, notes, exercises, timestamp } = route.params;
  const [totalPRs, setTotalPRs] = useState(0); 
  const [completionStatus, setCompletionStatus] = useState('Completed');
  const [comparisonData, setComparisonData] = useState('');

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
      setComparisonData('You lifted more weight compared to your last workout!');
    };

    countTotalPRs();
  }, [exercises]);

  const findBestSet = (sets) => {
    return sets.reduce((best, set) => {
      const current1RM = calculate1RM(parseFloat(set.weight), parseInt(set.reps, 10));
      return current1RM > best.estimated1RM ? { ...set, estimated1RM: current1RM } : best;
    }, { estimated1RM: 0 });
  };

  useEffect(() => {
    const handleBackButton = () => {
      navigation.replace("Workout")
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      setTotalPRs(0);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <WorkoutSummary
          formattedTimestamp={timestamp}
          duration={duration}
          totalPRs={totalPRs}
          exercises={exercises}
          notes={notes}
          completionStatus={completionStatus}
          comparisonData={comparisonData}
          showActions={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B', // Change background color if needed
    padding: 10, // Add padding or other styles as needed
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  summaryContainer: {
    width: 400, // Add your desired width
    height: 650, // Add your desired height
    padding: 20,
    marginTop: 100,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center', // Center the content inside the container
  },
});

export default WorkoutDetails;
