import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from './FoodDetailScreenStyle';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFoodContext } from '../../context/FoodContext';

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food, meal, update, foodId, imageSource } = route.params;
  const { updateMealInDatabase } = useFoodContext();

  const [quantity, setQuantity] = useState(100); // Default quantity is 100 grams
  const [unit, setUnit] = useState('grams');
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const image = imageSource || require('../../assets/almond.png');

  const unitConversion = {
    grams: 1,
    ounces: 0.035274,
  };

  const units = ['grams', 'ounces'];

  const extractCalories = (caloriesString) => {
    if (typeof caloriesString === 'string') {
      const match = caloriesString.match(/(\d+)\s*kCal/i);  
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    } else if (typeof caloriesString === 'number') {
      return caloriesString;
    }
    return 0; 
  };

  const calculateNutrientValue = useCallback((nutrientPer100g) => {
    const quantityInGrams = unit === 'grams' ? quantity : quantity / unitConversion.ounces;
    const nutrientValue = Math.round((parseFloat(nutrientPer100g) || 0) * (quantityInGrams / 100));
    return nutrientValue;
  }, [quantity, unit]);

  const generateRandomHexId = (length = 8) => {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handleAddFood = async () => {
    if (quantity <= 0 || isNaN(quantity)) {
      Alert.alert("Invalid Quantity", "Please enter a valid quantity greater than 0.");
      return;
    }
  
    const updatedFoodDetails = {
      id: foodId || generateRandomHexId(), // Use random hexadecimal ID if not updating
      Nume_Produs: food.Nume_Produs || 'Unknown',
      Calorii: calculateNutrientValue(extractCalories(food.Calorii)),
      Carbohidrati: calculateNutrientValue(food.Carbohidrati),
      Grasimi: calculateNutrientValue(food.Grasimi),
      Proteine: calculateNutrientValue(food.Proteine),
      Fibre: calculateNutrientValue(food.Fibre),
      Zaharuri: calculateNutrientValue(food.Zaharuri),
      Sare: calculateNutrientValue(food.Sare),
      Grasimi_Saturate: calculateNutrientValue(food.Grasimi_Saturate),
      quantity,
      unit,
      image: imageSource || require('../../assets/almond.png'), // Ensure the image source is correctly set
    };
  
    try {
      if (update) {
        // Update the food item in the database
        await updateMealInDatabase(meal, foodId, updatedFoodDetails);
        navigation.navigate('Nutrition', { refresh: true, meal }); // Navigate to Nutrition after updating
      } else {
        // Add a new food item and navigate to the FoodSelection screen
        navigation.navigate('FoodSelection', { selectedFood: updatedFoodDetails, meal });
      }
    } catch (error) {
      Alert.alert("Update Failed", "There was an error updating the food item.");
      console.error('Update failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.foodImage} />
      <Text style={styles.foodName}>{food.Nume_Produs || 'Unknown'}</Text>
      <Text style={styles.foodNutrient}>Calories: {calculateNutrientValue(extractCalories(food.Calorii))} kcal</Text>
      <Text style={styles.foodNutrient}>Protein: {calculateNutrientValue(food.Proteine)} g</Text>
      <Text style={styles.foodNutrient}>Carbs: {calculateNutrientValue(food.Carbohidrati)} g</Text>
      <Text style={styles.foodNutrient}>Fat: {calculateNutrientValue(food.Grasimi)} g</Text>
      {showMore && (
        <>
          <Text style={styles.foodNutrient}>Fiber: {calculateNutrientValue(food.Fibre)} g</Text>
          <Text style={styles.foodNutrient}>Sugar: {calculateNutrientValue(food.Zaharuri)} g</Text>
          <Text style={styles.foodNutrient}>Sodium: {calculateNutrientValue(food.Sare)} mg</Text>
          <Text style={styles.foodNutrient}>Saturated Fat: {calculateNutrientValue(food.Grasimi_Saturate)} g</Text>
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
        <Text style={styles.addButtonText}>{update ? 'Update Food' : 'Add Food'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FoodDetailScreen;
