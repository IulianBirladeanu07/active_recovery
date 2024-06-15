import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from '../../services/authService';
import styles from './LoginScreenStyles'; // Import styles

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(email, password,navigation);
      // If login is successful, navigate to WorkoutScreen
      navigation.navigate('Home');

    } catch (error) {
      console.error(error);
      console.log(error)
      setError(handleSignInError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSignInError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email. Please check the email address or register for a new account.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password if you have forgotten it.';
      case 'auth/invalid-email':
        return 'The email address is not formatted correctly. Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support for more information.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later or reset your password.';
      default:
        return 'An unexpected error occurred. Please try again later. If the problem persists, contact support with this error code: ' + error.code;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegistrationScreen')}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
