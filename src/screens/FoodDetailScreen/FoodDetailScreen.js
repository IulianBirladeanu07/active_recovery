import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from './FoodDetailScreenStyle';
import { useRoute, useNavigation } from '@react-navigation/native';

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food, meal, update, foodId, imageSource } = route.params;

  const [quantity, setQuantity] = useState(100); // Default quantity is 100 grams
  const [unit, setUnit] = useState('grams');
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Use the image passed from FoodSelectionScreen or default image
  const image = imageSource || require('../../assets/almond.png');

  const unitConversion = {
    grams: 1,
    ounces: 0.035274,
  };

  const units = ['grams', 'ounces'];

  const extractCalories = (caloriesString) => {
    if (typeof caloriesString === 'string') {
      const match = caloriesString.match(/(\d+)\s*kCal/i);  // Regex to extract the number followed by 'kCal'
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    } else if (typeof caloriesString === 'number') {
      return caloriesString;
    }
    return 0; // Default to 0 if no match found
  };

  const calculateNutrientValue = useCallback((nutrientPer100g) => {
    const quantityInGrams = unit === 'grams' ? quantity : quantity / unitConversion.ounces;
    const nutrientValue = (parseFloat(nutrientPer100g) || 0) * (quantityInGrams / 100);
    return nutrientValue.toFixed(2);
  }, [quantity, unit]);

  const handleAddFood = () => {
    if (quantity <= 0 || isNaN(quantity)) {
      Alert.alert("Invalid Quantity", "Please enter a valid quantity greater than 0.");
      return;
    }

    const foodDetails = {
      id: foodId || food.id,
      name: food.Nume_Produs || 'Unknown',
      calories: calculateNutrientValue(extractCalories(food.Calorii)),
      carbs: calculateNutrientValue(food.Carbohidrati),
      fat: calculateNutrientValue(food.Grasimi),
      protein: calculateNutrientValue(food.Proteine),
      fiber: calculateNutrientValue(food.Fibre),
      sugar: calculateNutrientValue(food.Zaharuri),
      sodium: calculateNutrientValue(food.Sare),
      saturatedFat: calculateNutrientValue(food.Grasimi_Saturate),
      quantity,
      unit,
      image,  // Attach the image
    };

    navigation.navigate('FoodSelection', { selectedFood: foodDetails, meal });
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
