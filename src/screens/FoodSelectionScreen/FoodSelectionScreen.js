import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { debounce } from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './FoodSelectionScreenStyle';
import { fetchFrequentFoods, fetchProducts, fetchRecentMeals, fetchUsuallyUsedFoods } from '../../handlers/NutritionHandler';
import Fuse from 'fuse.js';
import { getFoodImage, categoryImageMap } from '../../services/foodImageService';
import { useFoodContext } from '../../context/FoodContext';
import FoodItem from '../../components/NutritionItem/FoodItem';
import MealItem from '../../components/NutritionItem/MealItem';
import FoodSearchItem from '../../components/NutritionItem/FoodSearchItem';

const FoodSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meal, selectedDate } = route.params;
  
  const { handleAddMeal } = useFoodContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categoryFoods, setCategoryFoods] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('frequent');
  const [isSearching, setIsSearching] = useState(false);

    // Memoized fuse instance to optimize search performance
  const fuse = useMemo(() => new Fuse(categoryFoods, {
    includeScore: true,
    keys: ['Nume_Produs', 'Categorie'],
    threshold: 0.3,
    distance: 200,
    minMatchCharLength: 2,
  }), [categoryFoods]);

  useEffect(() => {
    console.log('selected: ', selectedFoods)
}, [selectedFoods]);
  
  const fetchFoodsBySearch = useCallback(async (query) => {
    if (!query) return;

    setLoading(true);
    setMessage('');

    try {
      const fetchedFoods = await fetchProducts(
        [
          ['Nume_Produs_lower', '>=', query.toLowerCase()],
          ['Nume_Produs_lower', '<=', query.toLowerCase() + '\uf8ff']
        ],
        ['Nume_Produs_lower', 'asc'],
        100
      );

      if (fetchedFoods.length > 0) {
        setSearchResults(fetchedFoods);
      } else {
        setSearchResults([]); // Ensure no stale data remains
        setMessage('No foods found.');
      }
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      setMessage('Failed to fetch foods. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFoodsByCategory = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      if (selectedCategory === 'frequent') {
        const fetchedFoods = await fetchFrequentFoods();
        setCategoryFoods(fetchedFoods);
        setMessage(fetchedFoods.length > 0 ? '' : 'No foods found.');
      } else if (selectedCategory === 'recent') {
        const fetchedMeals = await fetchRecentMeals(meal);
        console.log('meals',fetchedMeals)
        setRecentMeals(fetchedMeals);
        setMessage(fetchedMeals.length > 0 ? '' : 'No meals found.');
      } else {
        setCategoryFoods([]);
        setRecentMeals([]);
        setMessage('Invalid category selected.');
      }
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      setMessage('Failed to fetch foods. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const debouncedFetchFoodsBySearch = useMemo(() => debounce((query) => {
    fetchFoodsBySearch(query);
  }, 300), [fetchFoodsBySearch]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      debouncedFetchFoodsBySearch(searchQuery);
    } else {
      setIsSearching(false);
      setSearchResults([]); // Clear search results when query is cleared
      fetchFoodsByCategory(); // Fetch the appropriate category when the search query is cleared
    }
  }, [searchQuery, debouncedFetchFoodsBySearch, fetchFoodsByCategory]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    // Perform client-side fuzzy search
    if (query && !isSearching) {
      const results = fuse.search(query).map(result => result.item);
      setSearchResults(results.length > 0 ? results : []);
    }
  }, [fuse, isSearching]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear the search query when changing categories
    setIsSearching(false); // Ensure we're not in search mode
    fetchFoodsByCategory(); // Fetch category foods when changing categories
  };

  const handleNavigateToFoodDetail = (food) => {
    navigation.navigate('FoodDetail', { food, meal, selectedDate: selectedDate });
  };

  const handlePlusPress = (item) => {
    setSelectedFoods((prevSelectedFoods) => {
      // Check if the item is already selected
      if (prevSelectedFoods.some(food => food.id === item.id)) {
        // Return the previous state if the item is already selected
        return prevSelectedFoods;
      }
  
      // Add the new item to the selectedFoods array
      return [...prevSelectedFoods, item];
    });
  };  
  
  const handleDone = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert("No Foods Selected", "Please select at least one food item before proceeding.");
      return;
    }

    try {
      await handleAddMeal(meal, selectedFoods, selectedDate);
      navigation.navigate('Nutrition', { refresh: true });
    } catch (error) {
      console.error("zError details:", error);
      Alert.alert("Error", "Failed to save the meal data. Please try again.");
    }
  };

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
      onPlusPress={handlePlusPress}  // Add this line
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

  return (
    <View style={styles.container}>
      <View style={styles.overlayContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="magnify" size={24} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search for foods"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={handleSearch}
              accessibilityLabel="Food search input"
            />
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="barcode-scan" size={24} style={styles.barcodeIcon} />
          </TouchableOpacity>
        </View>
      
       {!searchQuery && (
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'frequent' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryChange('frequent')}
          >
            <MaterialCommunityIcons 
              name="repeat" // You can choose other icons from MaterialCommunityIcons
              size={24} 
              color={selectedCategory === 'frequent' ? '#FFA726' : '#FFFFFF'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'recent' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryChange('recent')}
          >
            <MaterialCommunityIcons 
              name="history" // History icon for recent meals
              size={24} 
              color={selectedCategory === 'recent' ? '#FFA726' : '#FFFFFF'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'favorite' && styles.selectedCategoryButton]}
            onPress={() => handleCategoryChange('favorite')}
          >
            <MaterialCommunityIcons 
              name="muffin"
              size={24} 
              color={selectedCategory === 'favorite' ? '#FFA726' : '#FFFFFF'} 
            />
          </TouchableOpacity>
        </View>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!isSearching && selectedCategory === 'frequent' && (
        <View style={styles.foodListContainer}>
          <FlatList
            data={categoryFoods}
            renderItem={renderFrequentFoodItem}
            keyExtractor={item => item.id ? item.id.toString() : `${item.Nume_Produs}-${item.Categorie}-${Math.random()}`}
            ListEmptyComponent={() => (
              <Text style={styles.infoText}>No foods found.</Text>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      )}

      {!isSearching && selectedCategory === 'recent' && (
        <View style={styles.foodListContainer}>
          <FlatList
            data={recentMeals}
            renderItem={renderMealItem}
            keyExtractor={item => item.id ? item.id.toString() : `${item.date}-${item.mealType}-${Math.random()}`}
            ListEmptyComponent={() => (
              <Text style={styles.infoText}>No meals found.</Text>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      )}

      {isSearching && (
        <View style={styles.foodListContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderFoodSearchItem}
            keyExtractor={item => item.id ? item.id.toString() : `${item.Nume_Produs}-${item.Categorie}-${Math.random()}`}
            ListEmptyComponent={() => (
              <Text style={styles.infoText}>No foods found.</Text>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      )}

      {selectedFoods.length > 0 && (
        <View style={styles.doneButtonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>
              Done ({selectedFoods.length} {selectedFoods.length > 1 ? 'items' : 'item'})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FoodSelectionScreen;
