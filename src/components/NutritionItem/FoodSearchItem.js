import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getFoodImage, categoryImageMap } from '../../services/foodImageService';

const FoodSearchItem = ({ item, onPress, foodNameStyle, foodCaloriesStyle, foodNutrientStyle, foodImageStyle, macroContainerStyle, macroBoxStyle, macroLabelStyle, macroValueStyle }) => {
  const imageSource = getFoodImage(item.Nume_Produs, item.Categorie, categoryImageMap);

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.foodSearchItem}>
        <Image 
          source={imageSource} 
          style={[styles.foodImage, foodImageStyle]} 
          resizeMode="contain" 
        />
        <View style={styles.foodDetails}>
          <Text style={[styles.foodName, foodNameStyle]} numberOfLines={2} ellipsizeMode="tail">
            {item.Nume_Produs}
          </Text>
          <Text style={[styles.foodNutrient, foodCaloriesStyle]}>Calories: {item.Calorii ? `${item.Calorii} cals` : 'N/A'}</Text>
          <View style={[styles.macroContainer, macroContainerStyle]}>
            <View style={[styles.macroBox, macroBoxStyle]}>
              <Text style={[styles.macroLabel, macroLabelStyle]}>Protein</Text>
              <Text style={[styles.macroValue, macroValueStyle]}>{item.Proteine || 'N/A'}</Text>
            </View>
            <View style={[styles.macroBox, macroBoxStyle]}>
              <Text style={[styles.macroLabel, macroLabelStyle]}>Carbs</Text>
              <Text style={[styles.macroValue, macroValueStyle]}>{item.Carbohidrati || 'N/A'}</Text>
            </View>
            <View style={[styles.macroBox, macroBoxStyle]}>
              <Text style={[styles.macroLabel, macroLabelStyle]}>Fats</Text>
              <Text style={[styles.macroValue, macroValueStyle]}>{item.Grasimi || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  foodImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodNutrient: {
    fontSize: 14,
    color: '#666',
  },
  macroContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  macroBox: {
    marginRight: 10,
  },
  macroLabel: {
    fontSize: 12,
    color: '#444',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FoodSearchItem;
