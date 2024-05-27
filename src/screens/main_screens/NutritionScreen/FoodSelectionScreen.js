import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarcodeScanner from '../../../components/BarcodeScanner/BarcodeScanner';
import { addDocument, fetchDocuments } from '../NutritionScreen/NutritionHandler';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './FoodSelectionScreenStyle';
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

  const categoryMappings = [
    { keywords: ['almond'], image: categoryImageMap.almond },
    { keywords: ['apple'], image: categoryImageMap.apple },
    { keywords: ['avocado'], image: categoryImageMap.avocado },
    { keywords: ['bacon'], image: categoryImageMap.bacon },
    { keywords: ['banana'], image: categoryImageMap.banana },
    { keywords: ['beef'], image: categoryImageMap.beef },
    { keywords: ['blueberry'], image: categoryImageMap.blueberry },
    { keywords: ['bread'], image: categoryImageMap.bread },
    { keywords: ['cake'], image: categoryImageMap.cake },
    { keywords: ['candy cane'], image: categoryImageMap.candy_cane },
    { keywords: ['cereals'], image: categoryImageMap.cereals },
    { keywords: ['cheese'], image: categoryImageMap.cheese },
    { keywords: ['chicken breast raw'], image: categoryImageMap.chicken_breast_raw },
    { keywords: ['chicken breast (1)'], image: categoryImageMap.chicken_breast_1 },
    { keywords: ['chicken breast'], image: categoryImageMap.chicken_breast },
    { keywords: ['corn'], image: categoryImageMap.corn },
    { keywords: ['croissant'], image: categoryImageMap.croissant },
    { keywords: ['exercise list'], image: categoryImageMap.exercise_list },
    { keywords: ['food'], image: categoryImageMap.food },
    { keywords: ['french fries'], image: categoryImageMap.french_fries },
    { keywords: ['fried egg'], image: categoryImageMap.fried_egg },
    { keywords: ['fruit'], image: categoryImageMap.fruit },
    { keywords: ['hamburger'], image: categoryImageMap.hamburger },
    { keywords: ['history_'], image: categoryImageMap.history_ },
    { keywords: ['history list'], image: categoryImageMap.history_list },
    { keywords: ['history logo'], image: categoryImageMap.history_logo },
    { keywords: ['history'], image: categoryImageMap.history },
    { keywords: ['ice cream'], image: categoryImageMap.ice_cream },
    { keywords: ['loaf'], image: categoryImageMap.loaf },
    { keywords: ['mango'], image: categoryImageMap.mango },
    { keywords: ['measurements'], image: categoryImageMap.measurements },
    { keywords: ['meatballs'], image: categoryImageMap.meatballs },
    { keywords: ['milk'], image: categoryImageMap.milk },
    { keywords: ['milkshake'], image: categoryImageMap.milkshake },
    { keywords: ['minced meat'], image: categoryImageMap.minced_meat },
    { keywords: ['muffin'], image: categoryImageMap.muffin },
  ];

  for (const { keywords, image } of categoryMappings) {
    const regex = new RegExp(keywords.join('|'), 'i');
    if (regex.test(categoriesList)) {
      return image;
    }
  }

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

const fetchFoodsFromUSDAAPI = async (query) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=20&api_key=${USDA_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log('categories', data.foods.foodCategory)
    return data.foods || [];
  } catch (err) {
    console.error("Failed to fetch foods from USDA API:", err);
    throw err;
  }
};

const fetchFoodsFromOpenFoodFactsAPI = async (barcode) => {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.product ? [data.product] : [];
  } catch (err) {
    console.error("Failed to fetch foods from Open Food Facts API:", err);
    throw err;
  }
};

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
  const [showRecentFoods, setShowRecentFoods] = useState(true);


  
  useEffect(() => {
    const fetchRecentFoods = async () => {
      try {
        const localRecentFoods = await AsyncStorage.getItem('recentFoods');
        const parsedLocalRecentFoods = localRecentFoods ? JSON.parse(localRecentFoods) : [];

        const recentFoodsData = await fetchDocuments('recentFoods', [], ['timestamp', 'desc'], 5);
        const recentFoodsFromFirestore = recentFoodsData.map(item => item.food);

        const combinedRecentFoods = [...new Set([...parsedLocalRecentFoods, ...recentFoodsFromFirestore])].slice(0, 3);
        setRecentFoods(combinedRecentFoods);

        await AsyncStorage.setItem('recentFoods', JSON.stringify(combinedRecentFoods));
      } catch (err) {
        console.error("Failed to fetch recent foods:", err);
        setError('Failed to fetch recent foods. Please try again later.');
      }
    };
    fetchRecentFoods();
  }, []);

  
  const fetchFoods = useCallback(async (query) => {
    setLoading(true);
    try {
      const products = await fetchFoodsFromUSDAAPI(query);
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
    } finally {
      setLoading(false);
    }
  }, []);

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
      const foundFood = foods.find(food => food.product_name.toLowerCase().includes(query.toLowerCase()));
      const recentFoodToAdd = foundFood ? {
        ...foundFood,
        id: query
      } : {
        id: query,
        product_name: query,
        nutriments: {},
        image: getFoodImage([])
      };
  
      const updatedRecentFoods = [recentFoodToAdd, ...recentFoods].slice(0, 5);
      setRecentFoods(updatedRecentFoods);
      try {
        await addDocument('recentFoods', `${query}_${Date.now()}`, { food: recentFoodToAdd });
        await AsyncStorage.setItem('recentFoods', JSON.stringify(updatedRecentFoods));
      } catch (err) {
        console.error("Failed to save recent search:", err);
        setError('Failed to save recent search. Please try again later.');
      }
    }
  }, [searchQuery, recentFoods, foods]);

  const handleBarcodeRead = useCallback(async ({ data }) => {
    setBarcode(data);
    setScanning(false);
    setError('');

    try {
      const products = await fetchFoodsFromOpenFoodFactsAPI(data);
      if (products.length > 0) {
        const product = products[0];
        const food = {
          id: product.id,
          product_name: product.product_name || 'Unknown product',
          nutriments: {
            'energy-kcal_100g': product.nutriments['energy-kcal_100g'] || 'N/A',
            proteins_100g: product.nutriments.proteins_100g || 'N/A',
            carbohydrates_100g: product.nutriments.carbohydrates_100g || 'N/A',
            fat_100g: product.nutriments.fat_100g || 'N/A'
          },
          categories_tags_en: product.categories_tags || [],
          image: getFoodImage(product.categories_tags || [])
        };

        // Add scanned food to recent foods
        const updatedRecentFoods = [food, ...recentFoods].slice(0, 5);
        setRecentFoods(updatedRecentFoods);
        try {
          await addDocument('recentFoods', `${food.id}_${Date.now()}`, { food });
          await AsyncStorage.setItem('recentFoods', JSON.stringify(updatedRecentFoods));
        } catch (err) {
          console.error("Failed to save recent food:", err);
          setError('Failed to save recent food. Please try again later.');
        }

        navigation.navigate('FoodDetail', { food, meal, date: new Date().toISOString() });
      } else {
        setError('No food found with this barcode.');
      }
    } catch (err) {
      console.error("Failed to fetch food details:", err);
      setError('Failed to fetch food details. Please try again later.');
    }
  }, [navigation, meal, recentFoods]);

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
        <BarcodeScanner meal={meal} onBarcodeRead={handleBarcodeRead} />
      ) : (
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Search for food"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowRecentFoods(false)} // Hide recent foods when text input is focused
            onBlur={() => setShowRecentFoods(true)}  // Optionally show recent foods when text input loses focus          
            onEndEditing={handleSearchComplete}
          />
          <TouchableOpacity style={styles.scanButton} onPress={() => setScanning(true)}>
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
          {loading ? <ActivityIndicator size="large" color="#008080" /> : null}
          {showRecentFoods && recentFoods.length > 0 && (
            <>
              <Text style={styles.recentSearchesTitle}>Recent Foods</Text>
              <FlatList
                data={recentFoods}
                keyExtractor={(item, index) => `${item.id}_${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleFoodSelect(item)}>
                    <View style={styles.recentSearchItem}>
                      <Image source={item.image} style={styles.foodImage} />
                      <View style={styles.recentFoodDetails}>
                      <Text style={styles.recentSearchText}>{item.product_name}</Text>
                      <Text style={styles.foodNutrient}>Calories: {item.nutriments['energy-kcal_100g'] ?? 'N/A'}</Text>
                      <Text style={styles.foodNutrient}>Protein: {item.nutriments.proteins_100g ?? 'N/A'}g</Text>
                      <Text style={styles.foodNutrient}>Carbs: {item.nutriments.carbohydrates_100g ?? 'N/A'}g</Text>
                      <Text style={styles.foodNutrient}>Fat: {item.nutriments.fat_100g ?? 'N/A'}g</Text>
                    </View>
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
