import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUpWithEmailAndPassword, signInWithEmailAndPassword } from '../../../services/firebase';
import styles from './LoginScreenStyles'; // Import styles

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await signUpWithEmailAndPassword(email, password);
      setError(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      setError('A intervenit o eroare la înregistrare. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(email, password, navigation);
    } catch (error) {
      console.error(error);
      setError(handleSignInError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSignInError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Emailul sau parola sunt incorecte. Vă rugăm să încercați din nou.';
      default:
        return 'A intervenit o eroare. Vă rugăm să încercați din nou mai târziu.';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autentificare</Text>
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
          placeholder="Parolă"
          secureTextEntry={true}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Înregistrare</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Autentificare</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
