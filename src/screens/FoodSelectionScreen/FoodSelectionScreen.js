import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { debounce } from 'lodash';
import { useNavigation, useRoute } from '@react-navigation/native';
import BarcodeScanner from '../../components/BarcodeScanner/BarcodeScanner';
import styles from './FoodSelectionScreenStyle';
import { fetchFoodsFromUSDAAPI, fetchFoodsFromOpenFoodFactsAPI, getFoodImage, fetchRecentFoods } from '../../services/nutritionService';
import { addDocument } from '../../handlers/NutritionHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mapping categories to images
const categoryImageMap = {
  almond: require('../../assets/almond.png'),
  apple: require('../../assets/apple.png'),
  apple_juice: require('../../assets/apple_juice.png'),
  avocado: require('../../assets/avocado.png'),
  bacon: require('../../assets/bacon.png'),
  bagel: require('../../assets/bagel.png'),
  banana: require('../../assets/banana.png'),
  barley: require('../../assets/barley.png'),
  beef: require('../../assets/beef.png'),
  beetroot: require('../../assets/beetroor.png'), // Corrected file name
  blueberry: require('../../assets/blueberry.png'),
  bread: require('../../assets/bread.png'),
  broccoli: require('../../assets/brocolli.png'), // Corrected file name
  cake: require('../../assets/cake.png'),
  candy_cane: require('../../assets/candy-cane.png'),
  carrot: require('../../assets/carrot.png'),
  cereals: require('../../assets/cereals.png'),
  cheese: require('../../assets/cheese.png'),
  cherries: require('../../assets/cherries.png'),
  chicken_breast_raw: require('../../assets/chicken_breast_raw.png'),
  chicken_breast: require('../../assets/chicken-breast.png'),
  chocolate: require('../../assets/chocolate.png'),
  coconut: require('../../assets/coconut.png'),
  coffee: require('../../assets/coffee.png'),
  corn: require('../../assets/corn.png'),
  croissant: require('../../assets/croissant.png'),
  eggplant: require('../../assets/eggplant.png'),
  eggs: require('../../assets/eggs.png'),
  fish: require('../../assets/fish.png'),
  flour: require('../../assets/flour.png'),
  food: require('../../assets/food.png'),
  french_fries: require('../../assets/french_fries.png'),
  fried_egg: require('../../assets/fried-egg.png'),
  fruit: require('../../assets/fruit.png'),
  garlic: require('../../assets/garlic.png'),
  gingerbread: require('../../assets/gingerbread.png'),
  grapes: require('../../assets/grapes.png'),
  hamburger: require('../../assets/hamburger.png'),
  honey: require('../../assets/honey.png'),
  hot_dog: require('../../assets/hot_dog.png'),
  ice_cream: require('../../assets/ice-cream.png'),
  kiwi: require('../../assets/kiwi.png'),  
  lamb: require('../../assets/lamb.png'),
  lettuce: require('../../assets/lettuce.png'),
  lime: require('../../assets/lime.png'),
  loaf: require('../../assets/loaf.png'),
  mango: require('../../assets/mango.png'),
  measurements: require('../../assets/measurements.png'),
  meatballs: require('../../assets/meatballs.png'),
  milk: require('../../assets/milk.png'),
  milkshake: require('../../assets/milkshake.png'),
  minced_meat: require('../../assets/minced-meat.png'),
  muffin: require('../../assets/muffin.png'),
  nuts: require('../../assets/nuts.png'),
  oats: require('../../assets/oats.png'),
  olives: require('../../assets/olives.png'),
  onions: require('../../assets/onions.png'),
  orange: require('../../assets/orange.png'),
  orange_juice: require('../../assets/orange_juice.png'),
  pancake: require('../../assets/pancake.png'),
  pancakes: require('../../assets/pancakes.png'),
  papaya: require('../../assets/papaya.png'),
  pasta: require('../../assets/pasta.png'),
  peach: require('../../assets/peach.png'),
  peanuts: require('../../assets/peanuts.png'),
  pears: require('../../assets/pears.png'),
  peas: require('../../assets/peas.png'),
  pineapple: require('../../assets/pineapple.png'),
  pizza: require('../../assets/pizza.png'),
  popcorn: require('../../assets/popcorn.png'),
  potato: require('../../assets/potato.png'),
  potato_chips: require('../../assets/potato_chips.png'),
  potatoes: require('../../assets/potatoes.png'),
  pumpkin: require('../../assets/pumpkin.png'),
  quinoa: require('../../assets/quinoa.png'),
  radish: require('../../assets/radish.png'),
  raspberries: require('../../assets/raspberries.png'),
  rhubarb: require('../../assets/rhubarb.png'),
  rice: require('../../assets/rice.png'),
  salad: require('../../assets/salad.png'),
  salmon: require('../../assets/salmon.png'),
  sausages: require('../../assets/sausages.png'),
  shrooms: require('../../assets/shrooms.png'),
  spinach: require('../../assets/spinach.png'),
  steak: require('../../assets/steak.png'),
  strawberry: require('../../assets/strawberry.png'),
  sushi: require('../../assets/sushi.png'),
  sweet_corn: require('../../assets/sweet_corn.png'),
  sweet_potatoes: require('../../assets/sweet_potatoes.png'),
  tomatoes: require('../../assets/tomatoes.png'),
  tuna: require('../../assets/tuna.png'),
  turkey: require('../../assets/turkey.png'),
  watermelon: require('../../assets/watermelon.png'),
  white_bread: require('../../assets/white-bread.png'),
  yogurt: require('../../assets/yogurt.png'),
  default: require('../../assets/food.png'),
};

const FoodItem = React.memo(({ item, onPress }) => {
  const imageSource = getFoodImage(item.categories_tags_en, categoryImageMap);

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
  const { meal, date } = route.params; // Extract date from route params
  const [barcode, setBarcode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecentFoods, setShowRecentFoods] = useState(true);

  useEffect(() => {
    const fetchRecentFoodsData = async () => {
      try {
        const combinedRecentFoods = await fetchRecentFoods();
        setRecentFoods(combinedRecentFoods);
      } catch (err) {
        console.error("Failed to fetch recent foods:", err);
        setError('Failed to fetch recent foods. Please try again later.');
      }
    };
    fetchRecentFoodsData();
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
          image: getFoodImage(product.foodCategory ? [product.foodCategory] : [], categoryImageMap),
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
        image: getFoodImage([], categoryImageMap)
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
          image: getFoodImage(product.categories_tags || [], categoryImageMap)
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

        // Ensure the correct date is passed when navigating
        navigation.navigate('FoodDetail', { food, meal, date });
      } else {
        setError('No food found with this barcode.');
      }
    } catch (err) {
      console.error("Failed to fetch food details:", err);
      setError('Failed to fetch food details. Please try again later.');
    }
  }, [navigation, meal, recentFoods, date]);

  const handleFoodSelect = useCallback((food) => {
    // Ensure the correct date is passed when navigating
    navigation.navigate('FoodDetail', { food, meal, date });
  }, [navigation, meal, date]);

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
