import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { AppContext } from '../../../AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileScreen = ({ navigation }) => {
  const { setUserSettings, userSettings } = useContext(AppContext);
  const [profilePicture, setProfilePicture] = useState(userSettings.profilePicture || 'https://via.placeholder.com/150');
  const [targetCalories, setTargetCalories] = useState(userSettings.targetCalories);
  const [targetProtein, setTargetProtein] = useState(userSettings.targetProtein);
  const [targetFats, setTargetFats] = useState(userSettings.targetFats);
  const [targetCarbs, setTargetCarbs] = useState(userSettings.targetCarbs);
  const [username, setUsername] = useState(userSettings.username || '');
  const [email, setEmail] = useState(userSettings.email || '');
  const [age, setAge] = useState(userSettings.age || '');
  const [weight, setWeight] = useState(userSettings.weight || '');
  const [height, setHeight] = useState(userSettings.height || '');
  const [dob, setDob] = useState(userSettings.dob ? new Date(userSettings.dob) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    setUserSettings({
      profilePicture,
      targetCalories,
      targetProtein,
      targetFats,
      targetCarbs,
      username,
      email,
      age,
      weight,
      height,
      dob: dob.toISOString()
    });
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setProfilePicture(userSettings.profilePicture || 'https://via.placeholder.com/150');
    setTargetCalories(userSettings.targetCalories);
    setTargetProtein(userSettings.targetProtein);
    setTargetFats(userSettings.targetFats);
    setTargetCarbs(userSettings.targetCarbs);
    setUsername(userSettings.username || '');
    setEmail(userSettings.email || '');
    setAge(userSettings.age || '');
    setWeight(userSettings.weight || '');
    setHeight(userSettings.height || '');
    setDob(userSettings.dob ? new Date(userSettings.dob) : new Date());
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.uri);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
        <Text style={styles.username}>{username || 'Username'}</Text>
      </View>
      <Text style={styles.header}>Set Your Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(age)}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(weight)}
          onChangeText={setWeight}
          placeholder="Enter your weight"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(height)}
          onChangeText={setHeight}
          placeholder="Enter your height"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Date of Birth:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>{dob.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <Text style={styles.header}>Nutritional Targets</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Calories:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(targetCalories)}
          onChangeText={setTargetCalories}
          placeholder="Enter target calories"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Protein (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(targetProtein)}
          onChangeText={setTargetProtein}
          placeholder="Enter target protein"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Fats (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(targetFats)}
          onChangeText={setTargetFats}
          placeholder="Enter target fats"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Carbs (g):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(targetCarbs)}
          onChangeText={setTargetCarbs}
          placeholder="Enter target carbs"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#02111B',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePictureText: {
    color: '#00bfff',
    marginTop: 5,
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e3d58',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
