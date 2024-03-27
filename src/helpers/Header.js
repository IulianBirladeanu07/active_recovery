// Header.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const Header = ({ seconds, handleExit }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.exitButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exitButton: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
});

export default Header;
