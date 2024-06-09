import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, BackHandler, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import WorkoutSummary from './WorkoutSummary';

const WorkoutDetails = ({ route }) => {
  const navigation = useNavigation();
  const { duration, notes, exercises, timestamp } = route.params;
  const { totalPRs } = useContext(AuthContext);
  const [completionStatus, setCompletionStatus] = useState('Completed');
  const [comparisonData, setComparisonData] = useState('');

  useEffect(() => {
    setComparisonData('You lifted more weight compared to your last workout!');
  }, [exercises]);

  useEffect(() => {
    const handleBackButton = () => {
      navigation.replace("Workout");
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <WorkoutSummary
          formattedTimestamp={timestamp}
          duration={duration}
          totalPRs={totalPRs || 0}
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
