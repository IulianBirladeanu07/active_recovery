// Input.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ placeholder, value, onChangeText, keyboardType }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 320,
    height: 45,
    paddingHorizontal: 10,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
},
});

export default CustomInput;

