import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from './FoodDetailScreenStyle';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFoodContext } from '../../context/FoodContext';
import { getFoodImage, categoryImageMap } from '../../services/foodImageService';

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food, meal, update, foodId, selectedDate } = route.params;
  const { updateMealInDatabase, addMultipleFoods } = useFoodContext();

  const [quantity, setQuantity] = useState(1); // Default for combined foods is 1 portion
  const [unit, setUnit] = useState('grams');
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const isMultipleFoods = Array.isArray(meal?.foods);
  const foods = isMultipleFoods ? meal.foods : [food];

  const unitConversion = {
    grams: 1,
    ounces: 28.3495,
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

  const normalizeNutrientValues = (foodItem) => {
    const normalizedValues = {};
    const baseQuantity = foodItem.quantity || 100;

    normalizedValues.Calorii = (extractCalories(foodItem.Calorii) / baseQuantity) * 100;
    normalizedValues.Carbohidrati = (parseFloat(foodItem.Carbohidrati) / baseQuantity) * 100;
    normalizedValues.Grasimi = (parseFloat(foodItem.Grasimi) / baseQuantity) * 100;
    normalizedValues.Proteine = (parseFloat(foodItem.Proteine) / baseQuantity) * 100;
    normalizedValues.Fibre = (parseFloat(foodItem.Fibre) / baseQuantity) * 100;
    normalizedValues.Zaharuri = (parseFloat(foodItem.Zaharuri) / baseQuantity) * 100;
    normalizedValues.Sare = (parseFloat(foodItem.Sare) / baseQuantity) * 100;
    normalizedValues.Grasimi_Saturate = (parseFloat(foodItem.Grasimi_Saturate) / baseQuantity) * 100;

    return normalizedValues;
  };

  const calculateNutrientValue = useCallback((nutrientValuePer100g) => {
    const baseValue = parseFloat(nutrientValuePer100g) || 0;
    const adjustedQuantity = isMultipleFoods ? 1 : (quantity / 100); // For combined foods, always treat as 1 portion
    return Math.round(baseValue * adjustedQuantity);
  }, [quantity, isMultipleFoods]);

  const calculateTotalNutrients = useCallback(() => {
    return foods.reduce((totals, food) => {
      const normalized = normalizeNutrientValues(food);
      return {
        Calorii: (totals.Calorii || 0) + normalized.Calorii,
        Carbohidrati: (totals.Carbohidrati || 0) + normalized.Carbohidrati,
        Grasimi: (totals.Grasimi || 0) + normalized.Grasimi,
        Proteine: (totals.Proteine || 0) + normalized.Proteine,
        Fibre: (totals.Fibre || 0) + normalized.Fibre,
        Zaharuri: (totals.Zaharuri || 0) + normalized.Zaharuri,
        Sare: (totals.Sare || 0) + normalized.Sare,
        Grasimi_Saturate: (totals.Grasimi_Saturate || 0) + normalized.Grasimi_Saturate,
      };
    }, {});
  }, [foods]);

  const totalNutrients = calculateTotalNutrients();

  const generateRandomHexId = (length = 8) => {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handleAddFood = async () => {
    if (quantity <= 0 || isNaN(quantity)) {
      Alert.alert("Invalid Quantity", "Please enter a valid quantity greater than 0.");
      return;
    }

    const currentFoodId = foodId || generateRandomHexId();
  
    const updatedFoodDetails = {
      id: currentFoodId,
      Nume_Produs: isMultipleFoods ? 'Combined Foods' : (food.Nume_Produs || 'Unknown'),
      Calorii: calculateNutrientValue(totalNutrients.Calorii),
      Carbohidrati: calculateNutrientValue(totalNutrients.Carbohidrati),
      Grasimi: calculateNutrientValue(totalNutrients.Grasimi),
      Proteine: calculateNutrientValue(totalNutrients.Proteine),
      Fibre: calculateNutrientValue(totalNutrients.Fibre),
      Zaharuri: calculateNutrientValue(totalNutrients.Zaharuri),
      Sare: calculateNutrientValue(totalNutrients.Sare),
      Grasimi_Saturate: calculateNutrientValue(totalNutrients.Grasimi_Saturate),
      quantity,
      unit,
    };
  
    try {
      if (isMultipleFoods) {
        await addMultipleFoods(meal.mealType, foods.map(foodItem => ({
          ...foodItem,
          quantity,
          unit,
          ...normalizeNutrientValues(foodItem),
        })));
        navigation.navigate('Nutrition', { refresh: true, meal });
      } else {
        await updateMealInDatabase(meal, currentFoodId, updatedFoodDetails);
        navigation.navigate('FoodSelection', { selectedFood: updatedFoodDetails, meal, selectedDate });
      }
    } catch (error) {
      Alert.alert("Update Failed", "There was an error updating the food item.");
      console.error('Update failed:', error);
    }
  };

  const renderFoodImages = () => (
    <View style={styles.combinedImageContainer}>
      {foods.slice(0, 2).map((food, index) => {
        const foodImage = getFoodImage(food.Nume_Produs, food.Categorie, categoryImageMap);
        return (
          <Image
            key={food.id || index}
            source={foodImage}
            style={[styles.foodImage, { left: index * 30 }]}
            resizeMode="cover"
          />
        );
      })}
    </View>
  );

  useEffect(() => {
    if (food) {
      setQuantity(food.quantity || 100);
      setUnit(food.unit || 'grams');
    }
  }, [food]);

  useEffect(() => {
    calculateTotalNutrients();
  }, [quantity, unit, calculateTotalNutrients]);

  return (
    <View style={styles.container}>
      {renderFoodImages()}
      <Text style={styles.foodName}>{isMultipleFoods ? 'Combined Foods' : (food.Nume_Produs || 'Unknown')}</Text>
      <Text style={styles.foodNutrient}>Calories: {calculateNutrientValue(totalNutrients.Calorii)} kcal</Text>
      <Text style={styles.foodNutrient}>Protein: {calculateNutrientValue(totalNutrients.Proteine)} g</Text>
      <Text style={styles.foodNutrient}>Carbs: {calculateNutrientValue(totalNutrients.Carbohidrati)} g</Text>
      <Text style={styles.foodNutrient}>Fat: {calculateNutrientValue(totalNutrients.Grasimi)} g</Text>
      {showMore && (
        <>
          <Text style={styles.foodNutrient}>Fiber: {calculateNutrientValue(totalNutrients.Fibre)} g</Text>
          <Text style={styles.foodNutrient}>Sugar: {calculateNutrientValue(totalNutrients.Zaharuri)} g</Text>
          <Text style={styles.foodNutrient}>Sodium: {calculateNutrientValue(totalNutrients.Sare)} mg</Text>
          <Text style={styles.foodNutrient}>Saturated Fat: {calculateNutrientValue(totalNutrients.Grasimi_Saturate)} g</Text>
        </>
      )}
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <Text style={styles.showMoreText}>{showMore ? 'Show Less' : 'Show More'}</Text>
      </TouchableOpacity>
      <View style={styles.inputRow}>
        {isMultipleFoods ? (
          <Text style={styles.portionText}>1 portion</Text>
        ) : (
          <>
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
          </>
        )}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
        <Text style={styles.addButtonText}>{update ? 'Update Food' : 'Add Food'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FoodDetailScreen;
