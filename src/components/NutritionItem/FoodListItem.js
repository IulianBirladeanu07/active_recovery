import React from 'react';
import { FlatList, Text } from 'react-native';
import FoodSearchItem from './FoodSearchItem'
import FoodItem from './FoodItem';
import MealItem from './MealItem';
import styles from '../../screens/FoodSelectionScreen/FoodSelectionScreenStyle'

const FoodList = ({
  isSearching,
  selectedCategory,
  searchResults,
  categoryFoods,
  recentMeals,
  favoriteFoods,
  handleNavigateToFoodDetail,
  handlePlusPress
}) => {
  const renderFoodSearchItem = ({ item }) => (
    <FoodSearchItem
      item={item}
      onPress={handleNavigateToFoodDetail}
      foodNameStyle={styles.foodName}
      foodCaloriesStyle={styles.foodNutrient}
      foodNutrientStyle={styles.foodNutrient}
      foodImageStyle={styles.foodImage}
      macroContainerStyle={styles.macroContainer}
      macroBoxStyle={styles.macroBox}
      macroLabelStyle={styles.macroLabel}
      macroValueStyle={styles.macroValue}
    />
  );

  const renderFrequentFoodItem = ({ item }) => (
    <FoodItem
      item={item}
      onPress={handleNavigateToFoodDetail}
      onPlusPress={handlePlusPress}
      foodName={styles.foodName}
      foodCalories={styles.foodCalories}
      foodNutrient={styles.foodNutrient}
      foodImage={styles.foodImage}
      showPlusButton={true}
    />
  );

  const renderMealItem = ({ item }) => (
    <MealItem meal={item} />
  );

  const renderFavoriteFoodItem = ({ item }) => (
    <FoodItem
      item={item}
      onPress={handleNavigateToFoodDetail}
      onPlusPress={handlePlusPress}
      foodName={styles.foodName}
      foodCalories={styles.foodCalories}
      foodNutrient={styles.foodNutrient}
      foodImage={styles.foodImage}
      showPlusButton={true}
    />
  );

  if (isSearching) {
    return (
      <FlatList
        data={searchResults}
        renderItem={renderFoodSearchItem}
        keyExtractor={(item) => item.id?.toString() ?? `${item.Nume_Produs}-${item.Categorie}-${Math.random()}`}
        ListEmptyComponent={() => <Text style={styles.infoText}>No foods found.</Text>}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    );
  }

  switch (selectedCategory) {
    case 'frequent':
      return (
        <FlatList
          data={categoryFoods}
          renderItem={renderFrequentFoodItem}
          keyExtractor={(item) => item.id?.toString() ?? `${item.Nume_Produs}-${item.Categorie}-${Math.random()}`}
          ListEmptyComponent={() => <Text style={styles.infoText}>No foods found.</Text>}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      );
    case 'recent':
      return (
        <FlatList
          data={recentMeals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id?.toString() ?? `${item.date}-${item.mealType}-${Math.random()}`}
          ListEmptyComponent={() => <Text style={styles.infoText}>No meals found.</Text>}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      );
    case 'favorite':
      return (
        <FlatList
          data={favoriteFoods}
          renderItem={renderFavoriteFoodItem}
          keyExtractor={(item) => item.id?.toString() ?? `${item.Nume_Produs}-${item.Categorie}-${Math.random()}`}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No favorite foods found.</Text>}
        />
      );
    default:
      return null;
  }
};

export default FoodList;
