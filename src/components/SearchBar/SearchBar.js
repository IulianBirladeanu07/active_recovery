import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../screens/FoodSelectionScreen/FoodSelectionScreenStyle'

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, handleBarcodeScan }) => (
  <View style={styles.searchContainer}>
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="magnify" size={24} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Search for foods"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={handleSearch} // Ensure this handles setting searchQuery
        accessibilityLabel="Food search input"
      />
    </View>
    <TouchableOpacity onPress={handleBarcodeScan} accessibilityRole="button">
      <MaterialCommunityIcons name="barcode-scan" size={24} style={styles.barcodeIcon} />
    </TouchableOpacity>
  </View>
);

export default SearchBar;
