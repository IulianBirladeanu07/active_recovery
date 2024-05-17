import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import styles from './FoodDetailScreenStyle'; // Import the new styles
import { getFoodImage } from './FoodSelectionScreen'; // Reuse the image mapping function
import { useRoute } from '@react-navigation/native';

const FoodDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { food, meal } = route.params;
  const [quantity, setQuantity] = useState(100); // Default quantity in grams
  const [unit, setUnit] = useState('grams');
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const unitConversion = {
    grams: 1,
    ounces: 0.035274,
  };

  const units = ['grams', 'ounces'];

  const calculateNutrientValue = (nutrientPer100g) => {
    const quantityInGrams = unit === 'grams' ? quantity : quantity / unitConversion.ounces;
    return ((nutrientPer100g || 0) * (quantityInGrams / 100)).toFixed(2);
  };

  const handleAddFood = useCallback(() => {
    if (quantity <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a quantity greater than 0.");
      return;
    }

    const foodDetails = {
      name: food.product_name || 'Unknown',
      calories: calculateNutrientValue(food.nutriments?.['energy-kcal_100g']),
      quantity,
      unit,
    };

    navigation.navigate('Nutrition', { foodDetails, meal });
  }, [food, quantity, unit, navigation, meal]);

  const imageSource = getFoodImage(food.categories_tags_en);

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.foodImage} />
      <Text style={styles.foodName}>{food.product_name || 'Unknown'}</Text>
      <Text style={styles.foodNutrient}>Calories: {calculateNutrientValue(food.nutriments?.['energy-kcal_100g'])} kcal</Text>
      <Text style={styles.foodNutrient}>Protein: {calculateNutrientValue(food.nutriments?.proteins_100g)} g</Text>
      <Text style={styles.foodNutrient}>Carbs: {calculateNutrientValue(food.nutriments?.carbohydrates_100g)} g</Text>
      <Text style={styles.foodNutrient}>Fat: {calculateNutrientValue(food.nutriments?.fat_100g)} g</Text>
      {showMore && (
        <>
          <Text style={styles.foodNutrient}>Fiber: {calculateNutrientValue(food.nutriments?.fiber_100g)} g</Text>
          <Text style={styles.foodNutrient}>Sugar: {calculateNutrientValue(food.nutriments?.sugars_100g)} g</Text>
          <Text style={styles.foodNutrient}>Sodium: {calculateNutrientValue(food.nutriments?.sodium_100g)} mg</Text>
          <Text style={styles.foodNutrient}>Saturated Fat: {calculateNutrientValue(food.nutriments?.['saturated-fat_100g'])} g</Text>
          <Text style={styles.foodNutrient}>Cholesterol: {calculateNutrientValue(food.nutriments?.cholesterol_100g)} mg</Text>
        </>
      )}
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <Text style={styles.showMoreText}>{showMore ? 'Show Less' : 'Show More'}</Text>
      </TouchableOpacity>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
          placeholder="Enter quantity"
          placeholderTextColor="#ccc"
        />
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.unitSelector}>
            <Text style={styles.unitText}>{unit} ▼</Text>
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              {units.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setUnit(item);
                    setDropdownVisible(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
    </View>
  );
};

FoodDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      food: PropTypes.object.isRequired,
      meal: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

export default FoodDetailScreen;
