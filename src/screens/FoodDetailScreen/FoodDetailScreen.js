import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from './FoodDetailScreenStyle';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFoodContext } from '../../context/FoodContext';

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food, meal, update, foodId } = route.params;
  const { updateMealInDatabase } = useFoodContext();

  const [quantity, setQuantity] = useState(food.quantity || 100); // Default quantity is 100 grams
  const [unit, setUnit] = useState(food.unit || 'grams');
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const image = food.image || require('../../assets/almond.png');

  const unitConversion = {
    grams: 1,
    ounces: 0.035274,
  };

  const units = ['grams', 'ounces'];

  const calculateNutrientPer100g = (nutrientValue, currentQuantity) => {
    return currentQuantity ? nutrientValue / (currentQuantity / 100) : 0;
  };

  const calculateNutrientValue = useCallback(
    (nutrientPer100g) => {
      const quantityInGrams = unit === 'grams' ? quantity : quantity / unitConversion.ounces;
      return Math.round(nutrientPer100g * (quantityInGrams / 100));
    },
    [quantity, unit]
  );

  const handleUpdateFood = async () => {
    if (quantity <= 0 || isNaN(quantity)) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0.');
      return;
    }

    // Recalculate the nutrients based on the new quantity
    const updatedFoodDetails = {
      ...food,
      Calorii: calculateNutrientValue(calculateNutrientPer100g(food.Calorii, food.quantity)),
      Carbohidrati: calculateNutrientValue(calculateNutrientPer100g(food.Carbohidrati, food.quantity)),
      Grasimi: calculateNutrientValue(calculateNutrientPer100g(food.Grasimi, food.quantity)),
      Proteine: calculateNutrientValue(calculateNutrientPer100g(food.Proteine, food.quantity)),
      Fibre: calculateNutrientValue(calculateNutrientPer100g(food.Fibre, food.quantity)),
      Zaharuri: calculateNutrientValue(calculateNutrientPer100g(food.Zaharuri, food.quantity)),
      Sare: calculateNutrientValue(calculateNutrientPer100g(food.Sare, food.quantity)),
      Grasimi_Saturate: calculateNutrientValue(calculateNutrientPer100g(food.Grasimi_Saturate, food.quantity)),
      quantity,
      unit,
    };

    if (update) {
      await updateMealInDatabase(meal, foodId, updatedFoodDetails);
      navigation.navigate('Nutrition', { refresh: true });
    } else {
      navigation.navigate('FoodSelection', { selectedFood: updatedFoodDetails, meal });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.foodImage} />
      <Text style={styles.foodName}>{food.Nume_Produs || 'Unknown'}</Text>
      <Text style={styles.foodNutrient}>Calories: {calculateNutrientValue(calculateNutrientPer100g(food.Calorii, food.quantity))} kcal</Text>
      <Text style={styles.foodNutrient}>Protein: {calculateNutrientValue(calculateNutrientPer100g(food.Proteine, food.quantity))} g</Text>
      <Text style={styles.foodNutrient}>Carbs: {calculateNutrientValue(calculateNutrientPer100g(food.Carbohidrati, food.quantity))} g</Text>
      <Text style={styles.foodNutrient}>Fat: {calculateNutrientValue(calculateNutrientPer100g(food.Grasimi, food.quantity))} g</Text>
      {showMore && (
        <>
          <Text style={styles.foodNutrient}>Fiber: {calculateNutrientValue(calculateNutrientPer100g(food.Fibre, food.quantity))} g</Text>
          <Text style={styles.foodNutrient}>Sugar: {calculateNutrientValue(calculateNutrientPer100g(food.Zaharuri, food.quantity))} g</Text>
          <Text style={styles.foodNutrient}>Sodium: {calculateNutrientValue(calculateNutrientPer100g(food.Sare, food.quantity))} mg</Text>
          <Text style={styles.foodNutrient}>Saturated Fat: {calculateNutrientValue(calculateNutrientPer100g(food.Grasimi_Saturate, food.quantity))} g</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleUpdateFood}>
        <Text style={styles.addButtonText}>{update ? 'Update Food' : 'Add Food'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FoodDetailScreen;
