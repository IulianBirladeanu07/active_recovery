import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppContext } from '../../../AppContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase/compat/app';

const SettingsScreen = ({ navigation }) => {
  const { userSettings, setUserSettings } = useContext(AppContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(userSettings.notificationsEnabled || false);
  const [darkTheme, setDarkTheme] = useState(userSettings.darkTheme || false);

  const handleSave = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      const uid = user.uid;
      const newSettings = {
        notificationsEnabled,
        darkTheme,
      };
      // Save the new settings to your backend/database
      // await saveSettingsToDatabase(uid, newSettings);
      setUserSettings(newSettings);
      Alert.alert('Success', 'Settings updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChangePassword = () => {
    // Navigate to ChangePasswordScreen or implement change password logic here
    navigation.navigate('ChangePasswordScreen');
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      Alert.alert('Success', 'Logged out successfully!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#02111B', '#2A2D34']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#008080' : '#f4f3f4'}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Dark Theme</Text>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkTheme ? '#008080' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.card} onPress={handleChangePassword}>
          <Text style={styles.label}>Change Password</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleLogout}>
          <Text style={styles.label}>Logout</Text>
          <Ionicons name="exit-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <View style={styles.buttonBackground}>
              <Text style={styles.buttonText}>Save Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#02202B',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  label: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    shadowColor: '#000',
    backgroundColor: '#008080',
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
