import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDropdown = ({ options, selectedValue, onSelect, isVisible }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.dropdown}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownItemText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomDropdown;
