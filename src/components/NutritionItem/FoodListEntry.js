// components/FoodListEntry.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getFoodImage } from '../utils/foodUtils';

const FoodListEntry = ({ item, onPress }) => {
  const imageSource = getFoodImage(item.categories_tags_en);

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.foodItem}>
        <Image source={imageSource} style={styles.foodImage} />
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.product_name || 'Unknown'}</Text>
          <Text style={styles.foodNutrient}>Calories: {item.nutriments?.['energy-kcal_100g'] ?? 'N/A'}</Text>
          <Text style={styles.foodNutrient}>Protein: {item.nutriments?.proteins_100g ?? 'N/A'}g</Text>
          <Text style={styles.foodNutrient}>Carbs: {item.nutriments?.carbohydrates_100g ?? 'N/A'}g</Text>
          <Text style={styles.foodNutrient}>Fat: {item.nutriments?.fat_100g ?? 'N/A'}g</Text>
          <Text style={styles.foodCategories}>Categories: {item.categories_tags_en?.join(', ') ?? 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  foodImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  foodNutrient: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  foodCategories: {
    fontSize: 12,
    color: '#999999',
  },
});

export default React.memo(FoodListEntry);
