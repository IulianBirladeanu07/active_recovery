import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../../screens/FoodSelectionScreen/FoodSelectionScreenStyle'

const DoneButton = ({ selectedFoods, handleDone }) => {
  if (selectedFoods.length === 0) return null;

  return (
    <View style={styles.doneButtonContainer}>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={handleDone}
        activeOpacity={0.8}
      >
        <Text style={styles.doneButtonText}>
          Done ({selectedFoods.length} {selectedFoods.length > 1 ? 'items' : 'item'})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoneButton;
