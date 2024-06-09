import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { findBestSet } from '../../handlers/WorkoutHandler';

const WorkoutSummary = ({ 
  formattedTimestamp, 
  duration, 
  totalPRs, 
  exercises, 
  showActions = false, 
  notes, 
  completionStatus, 
  comparisonData, 
}) => {

  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const renderExercises = () => {
    return exercises.map((exercise, index) => {
      const bestSet = findBestSet(exercise.sets);
      return (
        <View key={index} style={styles.exerciseContainer}>
          <Text 
            style={styles.exerciseName} 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {`${exercise.sets.length} x ${exercise.exerciseName}`}
          </Text>
          <View style={styles.bestSetContainer}>
            <Text style={styles.bestSetText}>
              {bestSet.weight && bestSet.reps
                ? `${bestSet.weight} kg x ${bestSet.reps} reps`
                : 'N/A'}
            </Text>
          </View>
        </View>
      );
    });
  };

  const handleWorkoutShare = async () => {
    if (!hasPermission) {
      Alert.alert("Permission required", "Permission to access media library is required to share images.");
      return;
    }
  
    try {
      // Capture the view and save it to a temporary file
      const imageUri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
        result: 'tmpfile'
      });
  
      // Save the image to the media library
      const asset = await MediaLibrary.createAssetAsync(imageUri);
  
      // Share the image using expo-sharing
      await Sharing.shareAsync(asset.uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share to Instagram Story',
        UTI: 'public.png',
      });
    } catch (error) {
      console.error('Error sharing to Instagram Story:', error);
    }
  };

  const handleHomeScreen = () => {
    navigation.replace('Workout');
  };


  const viewRef = useRef();

  return (
    <View style={styles.container} ref={viewRef}>
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>{formattedTimestamp}</Text>
      </View>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
              <Text style={styles.summaryText}>{duration} min</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="trophy-outline" size={24} color="white" />
              <Text style={styles.summaryText}>{totalPRs}</Text>
            </View>
          </View>

          <View style={styles.exercisesSection}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Exercises</Text>
              <Text style={styles.headerText}>Best Set</Text>
            </View>
            {exercises && exercises.length > 0 ? renderExercises() : <Text style={styles.sectionText}>No exercises available</Text>}
          </View>

          {notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesHeader}>Workout Notes</Text>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          )}

          {completionStatus && (
            <View style={styles.completionStatusContainer}>
              <Text style={styles.completionStatusText}>Completion Status: {completionStatus}</Text>
            </View>
          )}

          {comparisonData && (
            <View style={styles.comparisonContainer}>
              <Text style={styles.comparisonHeader}>Comparison to Previous Workouts:</Text>
              <Text style={styles.comparisonText}>{comparisonData}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleWorkoutShare}>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color="white" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleHomeScreen}>
            <MaterialCommunityIcons name="play-circle" size={24} color="white" />
            <Text style={styles.actionButtonText}>Home screen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 17,
  },
  timestampContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timestamp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wrapper: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#02202B',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  exercisesSection: {
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 5,
    padding: 2,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestSetText: {
    color: '#A0AEC0',
    fontSize: 10,
  },
  exerciseName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: 150,
    overflow: 'hidden',
  },
  sectionText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  notesContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1F2937',
    borderRadius: 5,
  },
  notesHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  completionStatusContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1F2937',
    borderRadius: 5,
  },
  completionStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  comparisonContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1F2937',
    borderRadius: 5,
  },
  comparisonHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  comparisonText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
});

export default WorkoutSummary;
