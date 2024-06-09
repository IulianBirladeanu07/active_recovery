import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { signUpWithEmailAndPassword } from '../../services/authService';
import styles from './RegistrationScreenStyle'; // Import styles

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();

  const handleConfirmDate = (selectedDate) => {
    setDateOfBirth(selectedDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    setDatePickerVisibility(false);
  };

  const handleCancelDate = () => {
    setDatePickerVisibility(false);
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      // Perform form validation
      if (!email || !password || !confirmedPassword || !fullName || !dateOfBirth) {
        setError('Please fill out all fields.');
        setLoading(false);
        return;
      }
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      if (password !== confirmedPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      if (!isStrongPassword(password)) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        setLoading(false);
        return;
      }
      if (!isValidDate(dateOfBirth)) {
        setError('Please enter a valid date of birth (YYYY-MM-DD).');
        setLoading(false);
        return;
      }
      await signUpWithEmailAndPassword(email, password, fullName, dateOfBirth);
      setError(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() == year &&
      date.getMonth() + 1 == month &&
      date.getDate() == day
    );
  };

  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:<,.>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return 'Weak';
    if (password.length >= 10 && isStrongPassword(password)) return 'Strong';
    if (isStrongPassword(password)) return 'Good';
    return 'Weak';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Text style={[styles.passwordStrengthIndicator, { color: checkPasswordStrength(password) === 'Weak' ? 'red' : checkPasswordStrength(password) === 'Good' ? 'orange' : 'green' }]}>
          {checkPasswordStrength(password)}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          placeholder="Confirm Password"
          secureTextEntry={true}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          autoCapitalize="words"
        />
      </View>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setDatePickerVisibility(true)}>
        <Text style={styles.input}>{dateOfBirth ? dateOfBirth : 'Date of Birth'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display='spinner'
        onConfirm={handleConfirmDate}
        onCancel={handleCancelDate}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
