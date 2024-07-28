import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

const StepByStepProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('weight_loss');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [stressLevel, setStressLevel] = useState('low');
  const { setProfileSetupComplete } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleNextStep = () => {
    console.log(`Moving from step ${step} to step ${step + 1}`);
    setStep(step + 1);
  };

  const calculateROL = () => {
    let targetRol = 0.01; // Default ROL of 1%

    // Adjust ROL based on body fat percentage for men and women
    if (gender === 'male') {
      if (bodyFat < 8) {
        targetRol = 0.005; // 0.5% for shredded
      } else if (bodyFat < 12) {
        targetRol = 0.0075; // 0.75% for very lean
      } else if (bodyFat < 15) {
        targetRol = 0.01; // 1% for lean
      } else {
        targetRol = 0.0125; // 1.25% for thicc
      }
    } else {
      if (bodyFat < 16) {
        targetRol = 0.005; // 0.5% for shredded
      } else if (bodyFat < 20) {
        targetRol = 0.0075; // 0.75% for very lean
      } else if (bodyFat < 24) {
        targetRol = 0.01; // 1% for lean
      } else {
        targetRol = 0.0125; // 1.25% for thicc
      }
    }

    // Adjust ROL based on stress levels
    if (stressLevel === 'high') {
      targetRol *= 0.5; // Halve the ROL for high stress
    }

    console.log("rate of loss", targetRol)
    return targetRol;
  };

  const calculateWeightChangePlan = () => {
    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);
    const weightDifference = currentWeightNum - targetWeightNum;

    const plan = {
      type: '',
      ratePerMonth: 0,
      ratePerWeek: 0,
      notes: '',
      recommendedRateOfLoss: 0,
      targetWeight: targetWeightNum,
      currentWeight: currentWeightNum
    };

    const weeksPerMonth = 4.34524; // Average number of weeks per month

    if (fitnessGoals === 'weight_loss' && weightDifference > 0) {
      // Weight loss logic
      const rol = calculateROL();
      plan.type = 'weight_loss';
      plan.ratePerMonth = (rol * currentWeightNum) * weeksPerMonth;
      plan.ratePerWeek = rol * currentWeightNum;
      plan.recommendedRateOfLoss = rol;
      plan.notes = `Based on your current weight and body fat percentage, you should aim to lose approximately ${plan.ratePerWeek.toFixed(2)} kg per week or ${plan.ratePerMonth.toFixed(2)} kg per month.`;
      if (weightDifference <= 6) {
        plan.notes += ' Follow a gradual weight loss plan, avoid aggressive mini-cuts.';
      }
    } else if (fitnessGoals === 'muscle_gain') {
      // Muscle gain logic
      if (experienceLevel === 'beginner') {
        plan.type = 'bulk';
        plan.ratePerMonth = 0.016 * currentWeightNum; // Gain 1.6% per month
        plan.ratePerWeek = plan.ratePerMonth / weeksPerMonth;
        plan.notes = `For beginners, consider a bulk gaining approximately ${plan.ratePerWeek.toFixed(2)} kg per week or ${plan.ratePerMonth.toFixed(2)} kg per month.`;
      } else {
        plan.type = 'lean_bulk';
        plan.ratePerMonth = 0.01 * currentWeightNum; // Gain 1% per month
        plan.ratePerWeek = plan.ratePerMonth / weeksPerMonth;
        plan.notes = `For experienced individuals, consider lean bulking gaining approximately ${plan.ratePerWeek.toFixed(2)} kg per week or ${plan.ratePerMonth.toFixed(2)} kg per month.`;
      }
    }

    return plan;
  };

  const handleSaveProfile = async () => {
    console.log("Saving profile with the following data:");
    console.log({
      currentWeight,
      targetWeight,
      bodyFat,
      activityLevel,
      experienceLevel,
      gender,
      age,
      height,
      dietaryPreferences,
      fitnessGoals,
      medicalConditions,
      stressLevel,
    });

    const userId = firebase.auth().currentUser.uid;
    const rol = calculateROL();
    const weightChangePlan = calculateWeightChangePlan();
    const userData = {
      currentWeight: parseFloat(currentWeight),
      targetWeight: parseFloat(targetWeight),
      bodyFat: parseFloat(bodyFat),
      activityLevel,
      experienceLevel,
      gender,
      age: parseInt(age),
      height: parseFloat(height),
      dietaryPreferences,
      fitnessGoals,
      medicalConditions,
      stressLevel,
      recommendedROL: rol,
      weeklyLoss: parseFloat(currentWeight) * rol,
      weightChangePlan,
      profileSetupComplete: true,
    };
    try {
      await firebase.firestore().collection('users').doc(userId).set(userData, { merge: true });
      console.log("Profile saved successfully.");
      setProfileSetupComplete(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthenticatedScreens', params: { screen: 'Home' } }],
      });
    } catch (error) {
      console.error("Error saving profile: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 1: Current Weight</Text>
            <Text style={styles.description}>Please enter your current weight in kilograms (kg). This information will help us tailor your fitness plan.</Text>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="Current Weight (kg)"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 2: Target Weight</Text>
            <Text style={styles.description}>Please enter your target weight in kilograms (kg). This is the weight you aim to achieve.</Text>
            <TextInput
              style={styles.input}
              value={targetWeight}
              onChangeText={setTargetWeight}
              placeholder="Target Weight (kg)"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 3: Body Fat Percentage</Text>
            <Text style={styles.description}>Please enter your body fat percentage (%). This helps us determine a more accurate weight loss plan.</Text>
            <TextInput
              style={styles.input}
              value={bodyFat}
              onChangeText={setBodyFat}
              placeholder="Body Fat Percentage (%)"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 4: Activity Level</Text>
            <Text style={styles.description}>Select your daily activity level. This helps us determine the best exercise routine for you.</Text>
            <Picker
              selectedValue={activityLevel}
              onValueChange={(itemValue) => setActivityLevel(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sedentary (little or no exercise)" value="sedentary" />
              <Picker.Item label="Moderately Active (exercise 3-5 days a week)" value="moderately_active" />
              <Picker.Item label="Very Active (intense exercise 6-7 days a week)" value="very_active" />
            </Picker>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 5: Experience Level</Text>
            <Text style={styles.description}>Choose your fitness experience level. This helps us customize your workout plan.</Text>
            <Picker
              selectedValue={experienceLevel}
              onValueChange={(itemValue) => setExperienceLevel(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Beginner (0-2 years)" value="beginner" />
              <Picker.Item label="Intermediate (3-5 years)" value="intermediate" />
              <Picker.Item label="Advanced (5+ years)" value="advanced" />
            </Picker>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 6 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 6: Gender</Text>
            <Text style={styles.description}>Select your gender. This information helps us better personalize your fitness plan.</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 7 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 7: Stress Level</Text>
            <Text style={styles.description}>Select your current stress level. This helps us adjust your weight loss rate accordingly.</Text>
            <Picker
              selectedValue={stressLevel}
              onValueChange={(itemValue) => setStressLevel(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 8 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Step 8: Fitness Goals</Text>
            <Text style={styles.description}>Choose your primary fitness goal. This helps us tailor your fitness plan accordingly.</Text>
            <Picker
              selectedValue={fitnessGoals}
              onValueChange={(itemValue) => setFitnessGoals(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Weight Loss" value="weight_loss" />
              <Picker.Item label="Muscle Gain" value="muscle_gain" />
              <Picker.Item label="Overall Fitness" value="overall_fitness" />
              <Picker.Item label="Maintain Current Weight" value="maintain_weight" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#02111B',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#fdf5ec',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '100%',
    maxWidth: 400,
    color: '#000000',
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#fdf5ec',
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    maxWidth: 400,
    color: '#000000',
  },
  nextButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    maxWidth: 400,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    maxWidth: 400,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StepByStepProfileSetup;
