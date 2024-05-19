import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from './FoodDetailScreenStyle'; // Import the new styles
import { getFoodImage } from './FoodSelectionScreen'; // Reuse the image mapping function
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFoodContext } from '../../../../FoodContext'; // Ensure the context is imported

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food, meal, date, update, foodId } = route.params;
  const { handleAddFood, handleUpdateFood } = useFoodContext();

  const parsedDate = new Date(date); // Deserialize date string back to Date object
  const [quantity, setQuantity] = useState(food.quantity || 100); // Default quantity in grams or the existing quantity
  const [unit, setUnit] = useState(food.unit || 'grams');
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [image, setImage] = useState(food.image || getFoodImage(food.categories_tags_en) || categoryImageMap.default);

  const unitConversion = {
    grams: 1,
    ounces: 0.035274,
  };

  const units = ['grams', 'ounces'];

  const calculateNutrientValue = (nutrientPer100g) => {
    const quantityInGrams = unit === 'grams' ? quantity : quantity / unitConversion.ounces;
    return ((nutrientPer100g || 0) * (quantityInGrams / 100)).toFixed(2);
  };

  const handleAddOrUpdateFood = useCallback(() => {
    if (quantity <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a quantity greater than 0.");
      return;
    }

    const foodDetails = {
      ...food,
      name: food.product_name || 'Unknown',
      calories: calculateNutrientValue(food.nutriments?.['energy-kcal_100g']),
      carbs: calculateNutrientValue(food.nutriments?.['carbohydrates_100g']),
      fat: calculateNutrientValue(food.nutriments?.['fat_100g']),
      protein: calculateNutrientValue(food.nutriments?.['proteins_100g']),
      quantity,
      unit,
      image, // Ensure image has a valid value
    };

    if (update) {
      handleUpdateFood({ ...foodDetails, id: foodId }); // Update the existing food item
    } else {
      handleAddFood(foodDetails, meal, parsedDate); // Add a new food item
    }

    navigation.navigate('Nutrition');
  }, [food, quantity, unit, update, navigation, meal, parsedDate, handleAddFood, handleUpdateFood, foodId, image]);

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.foodImage} />
      <Text style={styles.foodName}>{food.product_name || 'Unknown'}</Text>
      <Text style={styles.foodNutrient}>Calories: {calculateNutrientValue(food.nutriments?.['energy-kcal_100g'])} kcal</Text>
      <Text style={styles.foodNutrient}>Protein: {calculateNutrientValue(food.nutriments?.proteins_100g)} g</Text>
      <Text style={styles.foodNutrient}>Carbs: {calculateNutrientValue(food.nutriments?.['carbohydrates_100g'])} g</Text>
      <Text style={styles.foodNutrient}>Fat: {calculateNutrientValue(food.nutriments?.['fat_100g'])} g</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateFood}>
        <Text style={styles.addButtonText}>Update Food</Text>
      </TouchableOpacity>
    </View>
  );
};

FoodDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      food: PropTypes.object.isRequired,
      meal: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      update: PropTypes.bool,
      foodId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

export default FoodDetailScreen;
