import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const NutritionSettingsScreen = ({ navigation }) => {
  const [calorieGoal, setCalorieGoal] = useState('');
  const [macronutrientGoals, setMacronutrientGoals] = useState({ protein: '', carbs: '', fats: '' });
  const [mealReminders, setMealReminders] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nutrition Settings</Text>

      <Text style={styles.subHeader}>Daily Calorie Goal</Text>
      <TextInput
        style={styles.input}
        value={calorieGoal}
        onChangeText={setCalorieGoal}
        placeholder="Enter your daily calorie goal"
        placeholderTextColor="#777"
        keyboardType="numeric"
      />

      <Text style={styles.subHeader}>Macronutrient Goals</Text>
      <TextInput
        style={styles.input}
        value={macronutrientGoals.protein}
        onChangeText={(value) => setMacronutrientGoals({ ...macronutrientGoals, protein: value })}
        placeholder="Enter your protein goal"
        placeholderTextColor="#777"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={macronutrientGoals.carbs}
        onChangeText={(value) => setMacronutrientGoals({ ...macronutrientGoals, carbs: value })}
        placeholder="Enter your carbs goal"
        placeholderTextColor="#777"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={macronutrientGoals.fats}
        onChangeText={(value) => setMacronutrientGoals({ ...macronutrientGoals, fats: value })}
        placeholder="Enter your fats goal"
        placeholderTextColor="#777"
        keyboardType="numeric"
      />

      <Text style={styles.subHeader}>Meal Reminders</Text>
      <TextInput
        style={styles.input}
        value={mealReminders}
        onChangeText={setMealReminders}
        placeholder="Enter your meal reminders"
        placeholderTextColor="#777"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default NutritionSettingsScreen;
