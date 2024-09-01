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
  
  console.log('meal: ', selectedDate)
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
    if (route.params?.selectedFood) {
        setSelectedFoods(prevFoods => {
            const existingFoodIndex = prevFoods.findIndex(food => food.Nume_Produs === route.params.selectedFood.Nume_Produs);
            
            if (existingFoodIndex !== -1) {
                // Food already exists, update quantity
                const updatedFoods = [...prevFoods];
                updatedFoods[existingFoodIndex].quantity += route.params.selectedFood.quantity;
                return updatedFoods;
            } else {
                // Food doesn't exist, add new entry
                return [...prevFoods, route.params.selectedFood];
            }
        });
    }
}, [route.params?.selectedFood]);
  
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
    navigation.navigate('FoodDetail', { food, meal, selectedDate });
  };

  const handleDone = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert("No Foods Selected", "Please select at least one food item before proceeding.");
      return;
    }

    try {
      const foodsWithImages = selectedFoods.map(food => ({
        ...food,
        image: getFoodImage(food.Nume_Produs, food.Categorie, categoryImageMap),
      }));

      await handleAddMeal(meal, foodsWithImages, selectedDate);
      navigation.navigate('Nutrition', { refresh: true });
    } catch (error) {
      console.error("Error details:", error);
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
      foodName={styles.foodName}
      foodCalories={styles.foodCalories}
      foodNutrient={styles.foodNutrient}
      foodImage={styles.foodImage}
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
              <Text style={selectedCategory === 'frequent' ? styles.selectedCategoryButtonText : styles.categoryButtonText}>
                FREQUENT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'recent' && styles.selectedCategoryButton]}
              onPress={() => handleCategoryChange('recent')}
            >
              <Text style={selectedCategory === 'recent' ? styles.selectedCategoryButtonText : styles.categoryButtonText}>
                RECENT
              </Text>
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
            contentContainerStyle={{ paddingBottom: 150 }}
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
            contentContainerStyle={{ paddingBottom: 150 }}
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
            contentContainerStyle={{ paddingBottom: 150 }}
          />
        </View>
      )}

      <LinearGradient
        colors={['transparent', '#02111B']}
        style={styles.gradient}
      />

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
