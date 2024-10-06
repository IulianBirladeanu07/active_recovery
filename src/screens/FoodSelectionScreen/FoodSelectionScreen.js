import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Animated, Easing } from 'react-native';
import { debounce } from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './FoodSelectionScreenStyle';
import { fetchFavoriteFoods, fetchFrequentFoods, fetchProducts, fetchRecentMeals } from '../../handlers/NutritionHandler';
import Fuse from 'fuse.js';
import { useFoodContext } from '../../context/FoodContext';
import FoodItem from '../../components/NutritionItem/FoodItem';
import MealItem from '../../components/NutritionItem/MealItem';
import FoodSearchItem from '../../components/NutritionItem/FoodSearchItem';

const FoodSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meal, selectedDate, selectedFood } = route.params;
  
  const { handleAddMeal } = useFoodContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categoryFoods, setCategoryFoods] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('frequent');
  const [isSearching, setIsSearching] = useState(false);
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current; // Use useRef to keep it consistent

  const scaleValue = useRef(new Animated.Value(1)).current; // FAB scale
  const rotationValue = useRef(new Animated.Value(0)).current; // FAB rotation
  const optionAnimations = useRef([]).current; // Array to store individual option animations

  // Initialize individual animations for each option
  useEffect(() => {
    optionAnimations.push(
      new Animated.Value(0), // Opacity and translate for first option
      new Animated.Value(0), // For the second option
      new Animated.Value(0), // For the third option
      new Animated.Value(0)  // For the fourth option
    );
  }, []);

  const handleFabPress = () => {
    // If searching, reset FAB state without toggling options
    if (isSearching) {
      setSearchQuery(''); // Clear search query when pressing FAB
      setSearchResults([]); // Clear search results
      setIsFabExpanded(false); // Collapse FAB options
      return;
    }

    setIsFabExpanded(!isFabExpanded);
    Animated.parallel([
      Animated.timing(animation, {
        toValue: isFabExpanded ? 0 : 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: isFabExpanded ? 1 : 1.1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rotationValue, {
        toValue: isFabExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!isFabExpanded) {
        animateOptions();
      }
    });
  };

  const animateOptions = () => {
    Animated.stagger(100, // Delay of 100ms between each option
      optionAnimations.map((anim, index) => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      )
    ).start();
  };

  const animatedRotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'], // FAB rotates by 45 degrees
  });

  const animatedSlideIn = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0], // Slide in from below
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Fade in the container
  });

  // Option-specific animations (translate and opacity for each option)
  const optionTransforms = optionAnimations.map(anim => ({
    opacity: anim,
    transform: [{
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0], // Slide up from 30px
      }),
    }],
  }));

  const handleOptionPress = (option) => {
    // Handle navigation or action based on the option pressed
    console.log(option);
    setIsFabExpanded(false); // Close options after selection
  };
    // Memoized fuse instance to optimize search performance
  const fuse = useMemo(() => new Fuse(categoryFoods, {
    includeScore: true,
    keys: ['Nume_Produs', 'Categorie'],
    threshold: 0.3,
    distance: 200,
    minMatchCharLength: 2,
  }), [categoryFoods]);

  useEffect(() => {
    if (selectedFood) {
      setSelectedFoods((prevSelectedFoods) => {
        // Check if the selected food is already in the list
        if (prevSelectedFoods.some(food => food.id === selectedFood.id)) {
          return prevSelectedFoods;
        }
        // Add the new selected food to the state
        return [...prevSelectedFoods, selectedFood];
      });
    }
  }, [selectedFood]);  

  useEffect(() => {
    console.log('selected: ', selectedFoods)
}, [selectedFoods]);
  
  console.log(isFabExpanded)

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
        setRecentMeals(fetchedMeals);
        setMessage(fetchedMeals.length > 0 ? '' : 'No meals found.');
      } else if (selectedCategory === 'favorite') {
        const fetchedFavorites = await fetchFavoriteFoods(meal);
        console.log("fetched", fetchedFavorites)
        setFavoriteFoods(fetchedFavorites);
        setMessage(fetchedFavorites.length > 0 ? '' : 'No favorite foods found.');
      } else {
        setCategoryFoods([]);
        setRecentMeals([]);
        setFavoriteFoods([]);
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
    setIsFabExpanded(false); // Collapse the FAB options when changing categories
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

  const  renderFrequentFoodItem = ({ item }) => (
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
              name="star"
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

      {!isSearching && selectedCategory === 'favorite' && (
        <View style={styles.foodListContainer}>
          <FlatList
            data={favoriteFoods}
            renderItem={renderFavoriteFoodItem}
            keyExtractor={item => item.id ? item.id.toString() : `${item.Nume_Produs}-${item.Categorie}-${Math.random()}`}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No favorite foods found.</Text>
            )}
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

    {/* The Floating Action Button (FAB) */}
    <TouchableOpacity 
      style={styles.fab} 
      onPress={handleFabPress}
    >
      <MaterialCommunityIcons name="note-edit" size={30} color="#fff" />
    </TouchableOpacity>

    {/* The container that holds the expanded options */}
    {isFabExpanded && (
        <Animated.View 
          style={[
            styles.optionsContainer, 
            { 
              opacity: animatedOpacity,
              transform: [{ translateY: animatedSlideIn }]  // Slide in the container
            }
          ]}
        >
          <View style={styles.optionsInnerContainer}>
            {/* Option 1 */}
            <Animated.View style={optionTransforms[0]}>
              <TouchableOpacity 
                style={styles.option} 
                onPress={() => handleOptionPress('Add New Food without barcode')}
              >
                <Text style={styles.optionText}>Add New Food without barcode</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Option 2 */}
            <Animated.View style={optionTransforms[1]}>
              <TouchableOpacity 
                style={styles.option} 
                onPress={() => handleOptionPress('Add New Food with barcode')}
              >
                <Text style={styles.optionText}>Add New Food with barcode</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Option 3 */}
            <Animated.View style={optionTransforms[2]}>
              <TouchableOpacity 
                style={styles.option} 
                onPress={() => handleOptionPress('Add New Meals')}
              >
                <Text style={styles.optionText}>Add New Meals</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Option 4 */}
            <Animated.View style={optionTransforms[3]}>
              <TouchableOpacity 
                style={styles.option} 
                onPress={() => handleOptionPress('Add Calories')}
              >
                <Text style={styles.optionText}>Add Calories</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
    )}
  </View>
  );
};

export default FoodSelectionScreen;
