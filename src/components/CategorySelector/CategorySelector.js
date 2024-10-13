import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../../screens/FoodSelectionScreen/FoodSelectionScreenStyle'

const CategorySelector = ({ selectedCategory, setSelectedCategory }) => (
  <View style={styles.categoryContainer}>
    {['frequent', 'recent', 'favorite'].map((category) => (
      <TouchableOpacity
        key={category}
        style={styles.categoryButton}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === category && styles.selectedCategoryButtonText,
          ]}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        {selectedCategory === category && (
          <View style={styles.underline} />
        )}
      </TouchableOpacity>
    ))}
  </View>
);

export default CategorySelector;