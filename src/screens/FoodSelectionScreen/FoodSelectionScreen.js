import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Alert, Text, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFoodContext } from '../../context/FoodContext';
import styles from './FoodSelectionScreenStyle';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategorySelector from '../../components/CategorySelector/CategorySelector';
import FoodList from '../../components/NutritionItem/FoodListItem';
import FabMenu from '../../components/FabMenu/FabMenu';
import DoneButton from '../../components/DoneButton/DoneButton';
import { useFoodSearch } from '../../helpers/useFoodSearch';
import useCategoryFoods from '../../helpers/useFoodCategory';
import { fetchFavoriteFoods, fetchFrequentFoods, fetchRecentMeals } from '../../handlers/NutritionHandler';

const FoodSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meal, selectedDate } = route.params;
  const { handleAddMeal } = useFoodContext();

  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isFabVisible, setIsFabVisible] = useState(true); // State to control FAB visibility
  const { searchQuery, setSearchQuery, searchResults, loading, handleSearch } = useFoodSearch();

  const {
    categoryFoods,
    recentMeals,
    favoriteFoods,
    selectedCategory,
    setSelectedCategory,
    fetchFoodsByCategory,
  } = useCategoryFoods(fetchFrequentFoods, fetchRecentMeals, fetchFavoriteFoods, meal);

  useEffect(() => {
    fetchFoodsByCategory();
  }, [selectedCategory, fetchFoodsByCategory]);

  useEffect(() => {
    setIsSearching(searchQuery.length > 0);
  }, [searchQuery]);

  const handleNavigateToFoodDetail = useCallback((food) => {
    navigation.navigate('FoodDetail', { food, meal, selectedDate });
  }, [navigation, meal, selectedDate]);

  const handlePlusPress = useCallback((item) => {
    setSelectedFoods((prevSelectedFoods) => {
      if (!prevSelectedFoods.some(food => food.id === item.id)) {
        return [...prevSelectedFoods, item];
      }
      return prevSelectedFoods;
    });
  }, []);

  const handleDone = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert("No Foods Selected", "Please select at least one food item before proceeding.");
      return;
    }

    try {
      await handleAddMeal(meal, selectedFoods, selectedDate);
      navigation.navigate('Nutrition', { refresh: true });
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error", "Failed to save the meal data. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Select {' ' + meal.charAt(0).toUpperCase() + meal.slice(1)}
      </Text>

      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch}
        onFocus={() => {
          setInputFocused(true);
          setIsFabVisible(false); // Hide the FAB when search input is focused
        }} 
        onBlur={() => {
          setInputFocused(false);
          setIsFabVisible(true); // Show the FAB when search input is blurred
          Keyboard.dismiss();
        }} 
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!isSearching && (
        <View style={styles.categorySelectorContainer}>
          <CategorySelector 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
          />
        </View>
      )}

      <View style={styles.foodListContainer}>
        <FoodList
          isSearching={isSearching}
          selectedCategory={selectedCategory}
          searchResults={searchResults}
          categoryFoods={categoryFoods}
          recentMeals={recentMeals}
          favoriteFoods={favoriteFoods}
          handleNavigateToFoodDetail={handleNavigateToFoodDetail}
          handlePlusPress={handlePlusPress}
        />
      </View>

      <DoneButton 
        selectedFoods={selectedFoods} 
        handleDone={handleDone} 
      />

      {!inputFocused && isFabVisible && (
        <FabMenu 
          isSearching={isSearching} 
          navigation={navigation}
        />
      )}
    </View>
  );
};


export default FoodSelectionScreen;
