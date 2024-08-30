import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getFoodImage, categoryImageMap } from '../../services/foodImageService';
import { useRoute, useNavigation } from '@react-navigation/native';

const MealItem = ({ meal }) => { // Added navigation prop
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  if (!meal || !meal.foods) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Meal data is missing!</Text>
      </View>
    );
  }

  const totalCalories = meal.foods.reduce((total, food) => total + (food.Calorii || 0), 0);

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName} numberOfLines={1} ellipsizeMode="tail">
        {item.Nume_Produs.length > 35 ? `${item.Nume_Produs.slice(0, 35)}...` : item.Nume_Produs}
      </Text>
      <Text style={styles.foodQuantity}>{item.quantity} g</Text>
    </View>
  );

  const combinedImage = meal.foods.length > 0 ? (
    <View style={styles.combinedImageContainer}>
      {meal.foods.slice(0, 2).map((food, index) => {
        const imageSource = getFoodImage(food.Nume_Produs, food.Categorie, categoryImageMap);
        return (
          <Image
            key={food.id || index}
            source={imageSource}
            style={[styles.foodImage, { left: index * 25 }]}
            resizeMode="cover"
          />
        );
      })}
    </View>
  ) : (
    <Text style={styles.noFoodsText}>No foods available</Text>
  );

  const toggleExpand = () => setExpanded(!expanded);

  // Handle the press action
  const handlePress = () => {
    navigation.navigate('FoodDetail', { meal }); // Navigate and pass meal data
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.mealItem}>
        <View style={styles.headerRow}>
          <Text style={styles.mealTitle}>
            {meal.date} - {meal.mealType}
          </Text>
          {combinedImage}
        </View>
        <FlatList
          data={expanded ? meal.foods : meal.foods.slice(0, 2)}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id || item.Nume_Produs}
          style={styles.foodList}
          scrollEnabled={false}
        />
        <View style={styles.footerRow}>
          {meal.foods.length > 2 && (
            <Text style={styles.expandText} onPress={toggleExpand}>
              {expanded ? 'Show less' : `+${meal.foods.length - 2} more`}
            </Text>
          )}
          <Text style={styles.totalCaloriesFooter}>
            {totalCalories > 0 ? `Total: ${totalCalories} kcal` : 'Calories not available'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mealItem: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#02303C',
    marginVertical: 8,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: RFValue(14),
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
  },
  combinedImageContainer: {
    flexDirection: 'row',
    width: 50,
    height: 30,
    position: 'relative',
  },
  foodImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
    position: 'absolute',
  },
  noFoodsText: {
    fontSize: RFValue(12),
    color: '#CCCCCC',
    textAlign: 'center',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  foodName: {
    fontSize: RFValue(12),
    color: '#FFFFFF',
    flex: 1,
  },
  foodQuantity: {
    fontSize: RFValue(12),
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FF0000',
    marginVertical: 8,
  },
  errorText: {
    fontSize: RFValue(12),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  foodList: {
    maxHeight: 60,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10, // Increased space above "Show less"
  },
  expandText: {
    fontSize: RFValue(12),
    color: '#FFA726',
    marginRight: 10,
  },
  totalCaloriesFooter: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
    color: '#FFA726',
  },
});

export default MealItem;
