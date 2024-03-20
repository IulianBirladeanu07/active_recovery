// AppScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ApplicationCustomScreen = ({ title, headerLeft, headerRight, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileButton}>{headerLeft}</View>
        <View style={styles.settingsButton}>{headerRight}</View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#02111B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  profileButton: {
    padding: 5,
  },
  settingsButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 1,
    right: 1,
  },
});

export default ApplicationCustomScreen;
