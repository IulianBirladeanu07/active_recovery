import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarcodeScanner from '../../../components/BarcodeScanner/BarcodeScanner';
import { addDocument, fetchDocuments } from '../../workout_screens/StartWorkout/WorkoutHandler';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './FoodSelectionScreenStyle'; // Importing the improved styles
import { useFoodContext } from '../../../../FoodContext';

// USDA API Key
const USDA_API_KEY = 'DEF1MdrT3VgRpaOygDAyNLrq4ccsCpCCI8sJZpnt';

// Mapping categories to images
const categoryImageMap = {
  almond: require('../../../assets/almond.png'),
  apple: require('../../../assets/apple.png'),
  avocado: require('../../../assets/avocado.png'),
  bacon: require('../../../assets/bacon.png'),
  banana: require('../../../assets/banana.png'),
  beef: require('../../../assets/beef.png'),
  blueberry: require('../../../assets/blueberry.png'),
  bread: require('../../../assets/bread.png'),
  cake: require('../../../assets/cake.png'),
  candy_cane: require('../../../assets/candy-cane.png'),
  cereals: require('../../../assets/cereals.png'),
  cheese: require('../../../assets/cheese.png'),
  chicken_breast_raw: require('../../../assets/chicken_breast_raw.png'),
  chicken_breast_1: require('../../../assets/chicken-breast (1).png'),
  chicken_breast: require('../../../assets/chicken-breast.png'),
  corn: require('../../../assets/corn.png'),
  croissant: require('../../../assets/croissant.png'),
  exercise_list: require('../../../assets/exercise_list.png'),
  food: require('../../../assets/food.png'),
  french_fries: require('../../../assets/french_fries.png'),
  fried_egg: require('../../../assets/fried-egg.png'),
  fruit: require('../../../assets/fruit.png'),
  hamburger: require('../../../assets/hamburger.png'),
  history_: require('../../../assets/history_.png'),
  history_list: require('../../../assets/history_list.png'),
  history_logo: require('../../../assets/history_logo.png'),
  history: require('../../../assets/history.png'),
  ice_cream: require('../../../assets/ice-cream.png'),
  loaf: require('../../../assets/loaf.png'),
  mango: require('../../../assets/mango.png'),
  measurements: require('../../../assets/measurements.png'),
  meatballs: require('../../../assets/meatballs.png'),
  milk: require('../../../assets/milk.png'),
  milkshake: require('../../../assets/milkshake.png'),
  minced_meat: require('../../../assets/minced-meat.png'),
  muffin: require('../../../assets/muffin.png'),
  default: require('../../../assets/food.png'),
};

export const getFoodImage = (categories) => {
  if (!categories) return categoryImageMap.default; // Default image if categories are undefined

  const categoriesList = categories.join(', ').toLowerCase();
  if (categoriesList.includes('almond')) return categoryImageMap.almond;
  if (categoriesList.includes('apple')) return categoryImageMap.apple;
  if (categoriesList.includes('avocado')) return categoryImageMap.avocado;
  if (categoriesList.includes('bacon')) return categoryImageMap.bacon;
  if (categoriesList.includes('banana')) return categoryImageMap.banana;
  if (categoriesList.includes('beef')) return categoryImageMap.beef;
  if (categoriesList.includes('blueberry')) return categoryImageMap.blueberry;
  if (categoriesList.includes('bread')) return categoryImageMap.bread;
  if (categoriesList.includes('cake')) return categoryImageMap.cake;
  if (categoriesList.includes('candy cane')) return categoryImageMap.candy_cane;
  if (categoriesList.includes('cereals')) return categoryImageMap.cereals;
  if (categoriesList.includes('cheese')) return categoryImageMap.cheese;
  if (categoriesList.includes('chicken breast raw')) return categoryImageMap.chicken_breast_raw;
  if (categoriesList.includes('chicken breast (1)')) return categoryImageMap.chicken_breast_1;
  if (categoriesList.includes('chicken breast')) return categoryImageMap.chicken_breast;
  if (categoriesList.includes('corn')) return categoryImageMap.corn;
  if (categoriesList.includes('croissant')) return categoryImageMap.croissant;
  if (categoriesList.includes('exercise list')) return categoryImageMap.exercise_list;
  if (categoriesList.includes('food')) return categoryImageMap.food;
  if (categoriesList.includes('french fries')) return categoryImageMap.french_fries;
  if (categoriesList.includes('fried egg')) return categoryImageMap.fried_egg;
  if (categoriesList.includes('fruit')) return categoryImageMap.fruit;
  if (categoriesList.includes('hamburger')) return categoryImageMap.hamburger;
  if (categoriesList.includes('history_')) return categoryImageMap.history_;
  if (categoriesList.includes('history list')) return categoryImageMap.history_list;
  if (categoriesList.includes('history logo')) return categoryImageMap.history_logo;
  if (categoriesList.includes('history')) return categoryImageMap.history;
  if (categoriesList.includes('ice cream')) return categoryImageMap.ice_cream;
  if (categoriesList.includes('loaf')) return categoryImageMap.loaf;
  if (categoriesList.includes('mango')) return categoryImageMap.mango;
  if (categoriesList.includes('measurements')) return categoryImageMap.measurements;
  if (categoriesList.includes('meatballs')) return categoryImageMap.meatballs;
  if (categoriesList.includes('milk')) return categoryImageMap.milk;
  if (categoriesList.includes('milkshake')) return categoryImageMap.milkshake;
  if (categoriesList.includes('minced meat')) return categoryImageMap.minced_meat;
  if (categoriesList.includes('muffin')) return categoryImageMap.muffin;
  return categoryImageMap.default; // Default image
};

const FoodItem = React.memo(({ item, onPress }) => {
  const imageSource = getFoodImage(item.categories_tags_en);

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.foodItem}>
        <Image source={imageSource} style={styles.foodImage} />
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.product_name || 'Unknown'}</Text>
          <Text style={styles.foodNutrient}>Calories: {item.nutriments?.['energy-kcal_100g'] ?? 'N/A'}</Text>
          <Text style={styles.foodNutrient}>Protein: {item.nutriments?.proteins_100g ?? 'N/A'}g</Text>
          <Text style={styles.foodNutrient}>Carbs: {item.nutriments?.carbohydrates_100g ?? 'N/A'}g</Text>
          <Text style={styles.foodNutrient}>Fat: {item.nutriments?.fat_100g ?? 'N/A'}g</Text>
          <Text style={styles.foodCategories}>Categories: {item.categories_tags_en?.join(', ') ?? 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const FoodSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meal } = route.params;
  const [barcode, setBarcode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentFoods = async () => {
      try {
        const localRecentFoods = await AsyncStorage.getItem('recentFoods');
        const parsedLocalRecentFoods = localRecentFoods ? JSON.parse(localRecentFoods) : [];

        const recentFoodsData = await fetchDocuments('recentFoods', [], ['timestamp', 'desc'], 5);
        const recentFoodsFromFirestore = recentFoodsData.map(item => item.food);

        const combinedRecentFoods = [...new Set([...parsedLocalRecentFoods, ...recentFoodsFromFirestore])].slice(0, 5);
        setRecentFoods(combinedRecentFoods);

        await AsyncStorage.setItem('recentFoods', JSON.stringify(combinedRecentFoods));
      } catch (err) {
        console.error("Failed to fetch recent foods:", err);
        setError('Failed to fetch recent foods. Please try again later.');
      }
    };
    fetchRecentFoods();
  }, []);

  const fetchFoodsFromAPI = useCallback(async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=20&api_key=${USDA_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.foods || [];
    } catch (err) {
      console.error("Failed to fetch foods from API:", err);
      setError('Failed to fetch foods. Please check your internet connection and try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFoods = useCallback(async (query) => {
    try {
      const products = await fetchFoodsFromAPI(query);
      const sortedProducts = products.map(product => {
        const name = product.description.toLowerCase();
        const queryLower = query.toLowerCase();
        const index = name.indexOf(queryLower);
        let score = 0;
        if (index === 0) {
          score = 2;
        } else if (index > 0) {
          score = 1;
        }
        return { 
          id: product.fdcId, 
          product_name: product.description, 
          nutriments: {
            'energy-kcal_100g': product.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 0,
            proteins_100g: product.foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein')?.value || 0,
            carbohydrates_100g: product.foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference')?.value || 0,
            fat_100g: product.foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)')?.value || 0
          },
          categories_tags_en: product.foodCategory ? [product.foodCategory] : [],
          image: getFoodImage(product.foodCategory ? [product.foodCategory] : []), // Assign image here
          score
        };
      }).sort((a, b) => b.score - a.score || a.product_name.localeCompare(b.product_name));
      setFoods(sortedProducts);
      await addDocument('foodSearches', query, { products: sortedProducts });
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      setError('Failed to fetch foods. Please try again later.');
    }
  }, [fetchFoodsFromAPI]);

  const debouncedFetchFoods = useMemo(() => debounce((query) => fetchFoods(query), 300), [fetchFoods]);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchFoods(searchQuery);
    }
  }, [searchQuery, debouncedFetchFoods]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setError('');
  }, []);

  const handleSearchComplete = useCallback(async () => {
    const query = searchQuery.trim();
    if (query && !recentFoods.some(food => food.id === query)) {
      const updatedRecentFoods = [{ id: query, product_name: query, categories_tags_en: [], nutriments: {}, image: getFoodImage([]) }, ...recentFoods].slice(0, 5);
      setRecentFoods(updatedRecentFoods);
      try {
        await addDocument('recentFoods', `${query}_${Date.now()}`, { food: { id: query, product_name: query, categories_tags_en: [], nutriments: {}, image: getFoodImage([]) } });
        await AsyncStorage.setItem('recentFoods', JSON.stringify(updatedRecentFoods));
      } catch (err) {
        console.error("Failed to save recent search:", err);
        setError('Failed to save recent search. Please try again later.');
      }
    }
  }, [searchQuery, recentFoods]);

  const handleBarcodeRead = useCallback(({ data }) => {
    setBarcode(data);
    setScanning(false);
    setError('');
    fetchFoods(data);
  }, [fetchFoods]);

  const handleFoodSelect = useCallback((food) => {
    navigation.navigate('FoodDetail', { food, meal, date: new Date().toISOString() });
  }, [navigation, meal]);

  const renderItem = useCallback(({ item }) => (
    <FoodItem item={item} onPress={handleFoodSelect} />
  ), [handleFoodSelect]);

  const getItemLayout = useCallback((data, index) => (
    { length: 70, offset: 70 * index, index }
  ), []);

  return (
    <View style={styles.container}>
      {scanning ? (
        <BarcodeScanner onBarcodeRead={handleBarcodeRead} />
      ) : (
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Search for food"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={handleSearch}
            onEndEditing={handleSearchComplete}
          />
          <TouchableOpacity style={styles.scanButton} onPress={() => setScanning(true)}>
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
          {loading ? <ActivityIndicator size="large" color="#008080" /> : null}
          {recentFoods.length > 0 && (
            <>
              <Text style={styles.recentSearchesTitle}>Recent Foods</Text>
              <FlatList
                data={recentFoods}
                keyExtractor={(item, index) => `${item.id}_${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleFoodSelect(item)}>
                    <View style={styles.recentSearchItem}>
                      <Image source={item.image} style={styles.foodImage} />
                      <Text style={styles.recentSearchText}>{item.product_name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          <FlatList
            data={foods}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            getItemLayout={getItemLayout}
          />
        </>
      )}
    </View>
  );
};

export default FoodSelectionScreen;
