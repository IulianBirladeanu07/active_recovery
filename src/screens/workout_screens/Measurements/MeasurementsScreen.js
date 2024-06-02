import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sendMeasurementsToFirestore, fetchLastMeasurements } from '../StartWorkout/WorkoutHandler';
import styles from './MeasurementScreenStyle';

const MeasurementScreen = () => {
  const navigation = useNavigation();
  const [measurements, setMeasurements] = useState({
    bodyWeight: '',
    shoulders: '',
    rightArmSize: '',
    leftArmSize: '',
    rightForearmSize: '',
    leftForearmSize: '',
    bodyFatPercentage: '',
    waist: '',
    hips: '',
    chest: '',
    back: '',
    rightCalf: '',
    leftCalf: '',
    rightLeg: '',
    leftLeg: '',
    neck: '',
    date: new Date().toISOString().split('T')[0], // Set default date to today
  });

  useEffect(() => {
    const getLastMeasurements = async () => {
      try {
        const lastMeasurements = await fetchLastMeasurements();
        if (lastMeasurements) {
          setMeasurements(lastMeasurements);
        }
      } catch (error) {
        console.error('Error fetching last measurements:', error);
        Alert.alert('Error', 'An error occurred while fetching the last measurements.');
      }
    };

    getLastMeasurements();
  }, []);

  const handleInputChange = (name, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]+$/.test(value)) {
      setMeasurements({
        ...measurements,
        [name]: value,
      });
    }
  };

  const isFormValid = () => {
    return Object.values(measurements).every(value => value !== '');
  };

  const saveMeasurements = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Input', 'Please fill out all fields with valid numerical values.');
      return;
    }

    try {
      await sendMeasurementsToFirestore(measurements);
      Alert.alert('Measurements Saved', 'Your measurements have been saved successfully.');
      // Clear the inputs after saving
      setMeasurements({
        bodyWeight: '',
        shoulders: '',
        rightArmSize: '',
        leftArmSize: '',
        rightForearmSize: '',
        leftForearmSize: '',
        bodyFatPercentage: '',
        waist: '',
        hips: '',
        chest: '',
        back: '',
        rightCalf: '',
        leftCalf: '',
        rightLeg: '',
        leftLeg: '',
        neck: '',
        date: new Date().toISOString().split('T')[0],
      });
      navigation.goBack('WorkoutScreen');
    } catch (error) {
      console.error('Error saving measurements:', error);
      Alert.alert('Error', 'An error occurred while saving the measurements.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Measurements</Text>
      </View>

      <View style={styles.circleContainer}>
        <View style={styles.profileSummary}>
          <MaterialCommunityIcons name="human" size={100} color="white" />
        </View>

        <View style={[styles.measurementItem, styles.top]}>
          <Text style={styles.measurementLabel}>Neck</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.neck}
            onChangeText={(value) => handleInputChange('neck', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.middle]}>
          <Text style={styles.measurementLabel}>Shoulders</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.shoulders}
            onChangeText={(value) => handleInputChange('shoulders', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.topRight]}>
          <Text style={styles.measurementLabel}>Right Arm</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.rightArmSize}
            onChangeText={(value) => handleInputChange('rightArmSize', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.topLeft]}>
          <Text style={styles.measurementLabel}>Left Arm</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.leftArmSize}
            onChangeText={(value) => handleInputChange('leftArmSize', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.centerRight]}>
          <Text style={styles.measurementLabel}>Chest</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.chest}
            onChangeText={(value) => handleInputChange('chest', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.centerLeft]}>
          <Text style={styles.measurementLabel}>Back</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.back}
            onChangeText={(value) => handleInputChange('back', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.bottomRight]}>
          <Text style={styles.measurementLabel}>Right Leg</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.rightLeg}
            onChangeText={(value) => handleInputChange('rightLeg', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.bottomLeft]}>
          <Text style={styles.measurementLabel}>Left Leg</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.leftLeg}
            onChangeText={(value) => handleInputChange('leftLeg', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.right]}>
          <Text style={styles.measurementLabel}>Right Calf</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.rightCalf}
            onChangeText={(value) => handleInputChange('rightCalf', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.left]}>
          <Text style={styles.measurementLabel}>Left Calf</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.leftCalf}
            onChangeText={(value) => handleInputChange('leftCalf', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.rightBottom]}>
          <Text style={styles.measurementLabel}>Right Forearm</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.rightForearmSize}
            onChangeText={(value) => handleInputChange('rightForearmSize', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.leftBottom]}>
          <Text style={styles.measurementLabel}>Left Forearm</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.leftForearmSize}
            onChangeText={(value) => handleInputChange('leftForearmSize', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.measurementItem, styles.bottom]}>
          <Text style={styles.measurementLabel}>Waist</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.waist}
            onChangeText={(value) => handleInputChange('waist', value)}
            keyboardType="numeric"
          />
          <Text style={styles.measurementLabel}>Hips</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.hips}
            onChangeText={(value) => handleInputChange('hips', value)}
            keyboardType="numeric"
          />
          <Text style={styles.measurementLabel}>Body Fat %</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.bodyFatPercentage}
            onChangeText={(value) => handleInputChange('bodyFatPercentage', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.measurementInputContainer}>
          <Text style={styles.measurementLabel}>Body Weight (lbs)</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.bodyWeight}
            onChangeText={(value) => handleInputChange('bodyWeight', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.measurementInputContainer}>
          <Text style={styles.measurementLabel}>Date</Text>
          <TextInput
            style={styles.measurementInput}
            value={measurements.date}
            onChangeText={(value) => handleInputChange('date', value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <TouchableOpacity onPress={saveMeasurements} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Measurements</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MeasurementScreen;
