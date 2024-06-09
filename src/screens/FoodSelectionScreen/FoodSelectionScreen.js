import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { debounce } from 'lodash';
import { useNavigation, useRoute } from '@react-navigation/native';
import BarcodeScanner from '../../components/BarcodeScanner/BarcodeScanner';
import styles from './FoodSelectionScreenStyle';
import { fetchFoodsFromUSDAAPI, fetchFoodsFromOpenFoodFactsAPI, getFoodImage, fetchRecentFoods } from '../../services/nutritionService'
import { addDocument } from '../../handlers/NutritionHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mapping categories to images
const categoryImageMap = {
  almond: require('../../assets/almond.png'),
  apple: require('../../assets/apple.png'),
  avocado: require('../../assets/avocado.png'),
  bacon: require('../../assets/bacon.png'),
  banana: require('../../assets/banana.png'),
  beef: require('../../assets/beef.png'),
  blueberry: require('../../assets/blueberry.png'),
  bread: require('../../assets/bread.png'),
  cake: require('../../assets/cake.png'),
  candy_cane: require('../../assets/candy-cane.png'),
  cereals: require('../../assets/cereals.png'),
  cheese: require('../../assets/cheese.png'),
  chicken_breast_raw: require('../../assets/chicken_breast_raw.png'),
  chicken_breast: require('../../assets/chicken-breast.png'),
  corn: require('../../assets/corn.png'),
  croissant: require('../../assets/croissant.png'),
  food: require('../../assets/food.png'),
  french_fries: require('../../assets/french_fries.png'),
  fried_egg: require('../../assets/fried-egg.png'),
  fruit: require('../../assets/fruit.png'),
  hamburger: require('../../assets/hamburger.png'),
  ice_cream: require('../../assets/ice-cream.png'),
  loaf: require('../../assets/loaf.png'),
  mango: require('../../assets/mango.png'),
  meatballs: require('../../assets/meatballs.png'),
  milk: require('../../assets/milk.png'),
  milkshake: require('../../assets/milkshake.png'),
  minced_meat: require('../../assets/minced-meat.png'),
  muffin: require('../../assets/muffin.png'),
  default: require('../../assets/food.png'),
  // New mappings added previously
  apple_juice: require('../../assets/apple_juice.png'),
  apricot: require('../../assets/apricot.png'),
  asparagus: require('../../assets/asparagus.png'),
  bacon_burger: require('../../assets/bacon_burger.png'),
  bagel: require('../../assets/bagel.png'),
  baked_beans: require('../../assets/baked_beans.png'),
  barley: require('../../assets/barley.png'),
  beef_stew: require('../../assets/beef_stew.png'),
  beetroot: require('../../assets/beetroot.png'),
  bell_pepper: require('../../assets/bell_pepper.png'),
  blackberries: require('../../assets/blackberries.png'),
  blackcurrant: require('../../assets/blackcurrant.png'),
  bok_choy: require('../../assets/bok_choy.png'),
  bran_flakes: require('../../assets/bran_flakes.png'),
  broccoli: require('../../assets/broccoli.png'),
  brown_bread: require('../../assets/brown_bread.png'),
  brussels_sprouts: require('../../assets/brussels_sprouts.png'),
  butter: require('../../assets/butter.png'),
  butternut_squash: require('../../assets/butternut_squash.png'),
  cabbage: require('../../assets/cabbage.png'),
  carrot: require('../../assets/carrot.png'),
  cauliflower: require('../../assets/cauliflower.png'),
  celery: require('../../assets/celery.png'),
  cherries: require('../../assets/cherries.png'),
  chicken_curry: require('../../assets/chicken_curry.png'),
  chicken_leg: require('../../assets/chicken_leg.png'),
  chickpeas: require('../../assets/chickpeas.png'),
  chili_pepper: require('../../assets/chili_pepper.png'),
  chocolate: require('../../assets/chocolate.png'),
  cinnamon_roll: require('../../assets/cinnamon_roll.png'),
  coconut: require('../../assets/coconut.png'),
  coffee: require('../../assets/coffee.png'),
  couscous: require('../../assets/couscous.png'),
  cranberries: require('../../assets/cranberries.png'),
  cucumber: require('../../assets/cucumber.png'),
  dates: require('../../assets/dates.png'),
  dragonfruit: require('../../assets/dragonfruit.png'),
  dumplings: require('../../assets/dumplings.png'),
  eggplant: require('../../assets/eggplant.png'),
  eggs_benedict: require('../../assets/eggs_benedict.png'),
  fish_fingers: require('../../assets/fish_fingers.png'),
  flour: require('../../assets/flour.png'),
  garlic: require('../../assets/garlic.png'),
  ginger: require('../../assets/ginger.png'),
  grapes: require('../../assets/grapes.png'),
  green_tea: require('../../assets/green_tea.png'),
  hazelnuts: require('../../assets/hazelnuts.png'),
  honey: require('../../assets/honey.png'),
  hot_dog: require('../../assets/hot_dog.png'),
  hummus: require('../../assets/hummus.png'),
  kale: require('../../assets/kale.png'),
  kiwi: require('../../assets/kiwi.png'),
  lamb: require('../../assets/lamb.png'),
  lemon: require('../../assets/lemon.png'),
  lentils: require('../../assets/lentils.png'),
  lettuce: require('../../assets/lettuce.png'),
  lime: require('../../assets/lime.png'),
  lychee: require('../../assets/lychee.png'),
  macaroni: require('../../assets/macaroni.png'),
  mackerel: require('../../assets/mackerel.png'),
  mushrooms: require('../../assets/mushrooms.png'),
  nectarine: require('../../assets/nectarine.png'),
  oats: require('../../assets/oats.png'),
  olives: require('../../assets/olives.png'),
  onions: require('../../assets/onions.png'),
  orange: require('../../assets/orange.png'),
  pancakes: require('../../assets/pancakes.png'),
  papaya: require('../../assets/papaya.png'),
  pasta: require('../../assets/pasta.png'),
  peaches: require('../../assets/peaches.png'),
  peanuts: require('../../assets/peanuts.png'),
  pears: require('../../assets/pears.png'),
  peas: require('../../assets/peas.png'),
  pineapple: require('../../assets/pineapple.png'),
  plums: require('../../assets/plums.png'),
  pomegranate: require('../../assets/pomegranate.png'),
  potato_chips: require('../../assets/potato_chips.png'),
  potatoes: require('../../assets/potatoes.png'),
  pumpkin: require('../../assets/pumpkin.png'),
  quinoa: require('../../assets/quinoa.png'),
  radish: require('../../assets/radish.png'),
  raspberries: require('../../assets/raspberries.png'),
  red_cabbage: require('../../assets/red_cabbage.png'),
  rhubarb: require('../../assets/rhubarb.png'),
  rice: require('../../assets/rice.png'),
  salmon: require('../../assets/salmon.png'),
  sausages: require('../../assets/sausages.png'),
  spinach: require('../../assets/spinach.png'),
  strawberries: require('../../assets/strawberries.png'),
  sweet_corn: require('../../assets/sweet_corn.png'),
  sweet_potato: require('../../assets/sweet_potato.png'),
  tomatoes: require('../../assets/tomatoes.png'),
  tuna: require('../../assets/tuna.png'),
  turkey: require('../../assets/turkey.png'),
  walnuts: require('../../assets/walnuts.png'),
  watermelon: require('../../assets/watermelon.png'),
  yogurt: require('../../assets/yogurt.png'),
  // Additional 100 mappings
  acorn_squash: require('../../assets/acorn_squash.png'),
  artichoke: require('../../assets/artichoke.png'),
  arugula: require('../../assets/arugula.png'),
  bacon_wrapped_dates: require('../../assets/bacon_wrapped_dates.png'),
  banana_bread: require('../../assets/banana_bread.png'),
  bbq_chicken: require('../../assets/bbq_chicken.png'),
  bbq_ribs: require('../../assets/bbq_ribs.png'),
  beet_salad: require('../../assets/beet_salad.png'),
  biscotti: require('../../assets/biscotti.png'),
  blackberry_jam: require('../../assets/blackberry_jam.png'),
  blueberry_pie: require('../../assets/blueberry_pie.png'),
  bok_choy_stir_fry: require('../../assets/bok_choy_stir_fry.png'),
  bouillabaisse: require('../../assets/bouillabaisse.png'),
  bread_pudding: require('../../assets/bread_pudding.png'),
  breakfast_burrito: require('../../assets/breakfast_burrito.png'),
  broccoli_soup: require('../../assets/broccoli_soup.png'),
  brown_rice: require('../../assets/brown_rice.png'),
  brussels_sprouts_roasted: require('../../assets/brussels_sprouts_roasted.png'),
  buffalo_wings: require('../../assets/buffalo_wings.png'),
  buttermilk_pancakes: require('../../assets/buttermilk_pancakes.png'),
  caprese_salad: require('../../assets/caprese_salad.png'),
  caramel_apple: require('../../assets/caramel_apple.png'),
  cauliflower_rice: require('../../assets/cauliflower_rice.png'),
  celery_sticks: require('../../assets/celery_sticks.png'),
  cherry_tomatoes: require('../../assets/cherry_tomatoes.png'),
  chicken_biryani: require('../../assets/chicken_biryani.png'),
  chicken_nuggets: require('../../assets/chicken_nuggets.png'),
  chicken_parmesan: require('../../assets/chicken_parmesan.png'),
  chicken_satay: require('../../assets/chicken_satay.png'),
  chocolate_chip_cookies: require('../../assets/chocolate_chip_cookies.png'),
  clam_chowder: require('../../assets/clam_chowder.png'),
  coconut_shrimp: require('../../assets/coconut_shrimp.png'),
  coleslaw: require('../../assets/coleslaw.png'),
  crab_cakes: require('../../assets/crab_cakes.png'),
  cranberry_sauce: require('../../assets/cranberry_sauce.png'),
  cream_cheese: require('../../assets/cream_cheese.png'),
  creme_brulee: require('../../assets/creme_brulee.png'),
  deviled_eggs: require('../../assets/deviled_eggs.png'),
  dill_pickles: require('../../assets/dill_pickles.png'),
  egg_salad: require('../../assets/egg_salad.png'),
  french_onion_soup: require('../../assets/french_onion_soup.png'),
  fried_rice: require('../../assets/fried_rice.png'),
  fruit_salad: require('../../assets/fruit_salad.png'),
  garlic_bread: require('../../assets/garlic_bread.png'),
  gazpacho: require('../../assets/gazpacho.png'),
  gingerbread_cookies: require('../../assets/gingerbread_cookies.png'),
  grilled_cheese: require('../../assets/grilled_cheese.png'),
  grilled_vegetables: require('../../assets/grilled_vegetables.png'),
  guacamole: require('../../assets/guacamole.png'),
  hash_browns: require('../../assets/hash_browns.png'),
  ice_cream_sandwich: require('../../assets/ice_cream_sandwich.png'),
  jalapeno_poppers: require('../../assets/jalapeno_poppers.png'),
  kale_salad: require('../../assets/kale_salad.png'),
  key_lime_pie: require('../../assets/key_lime_pie.png'),
  lasagna: require('../../assets/lasagna.png'),
  lobster_bisque: require('../../assets/lobster_bisque.png'),
  mac_and_cheese: require('../../assets/mac_and_cheese.png'),
  maple_syrup: require('../../assets/maple_syrup.png'),
  meatloaf: require('../../assets/meatloaf.png'),
  miso_soup: require('../../assets/miso_soup.png'),
  naan: require('../../assets/naan.png'),
  nachos: require('../../assets/nachos.png'),
  oatmeal: require('../../assets/oatmeal.png'),
  orange_juice: require('../../assets/orange_juice.png'),
  pad_thai: require('../../assets/pad_thai.png'),
  paella: require('../../assets/paella.png'),
  pancakes_blueberry: require('../../assets/pancakes_blueberry.png'),
  pecan_pie: require('../../assets/pecan_pie.png'),
  pesto_pasta: require('../../assets/pesto_pasta.png'),
  pho: require('../../assets/pho.png'),
  pita_bread: require('../../assets/pita_bread.png'),
  pizza_pepperoni: require('../../assets/pizza_pepperoni.png'),
  pork_chops: require('../../assets/pork_chops.png'),
  quinoa_salad: require('../../assets/quinoa_salad.png'),
  ratatouille: require('../../assets/ratatouille.png'),
  red_velvet_cake: require('../../assets/red_velvet_cake.png'),
  risotto: require('../../assets/risotto.png'),
  salsa: require('../../assets/salsa.png'),
  shepherds_pie: require('../../assets/shepherds_pie.png'),
  shrimp_scampi: require('../../assets/shrimp_scampi.png'),
  spaghetti_bolognese: require('../../assets/spaghetti_bolognese.png'),
  stuffed_peppers: require('../../assets/stuffed_peppers.png'),
  sushi: require('../../assets/sushi.png'),
  tacos: require('../../assets/tacos.png'),
  tiramisu: require('../../assets/tiramisu.png'),
  tostadas: require('../../assets/tostadas.png'),
  turkey_sandwich: require('../../assets/turkey_sandwich.png'),
  vegetable_stir_fry: require('../../assets/vegetable_stir_fry.png'),
  waffles: require('../../assets/waffles.png'),
  zucchini_bread: require('../../assets/zucchini_bread.png'),
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
          image: getFoodImage(product.foodCategory ? [product.foodCategory] : [], categoryImageMap), // Assign image here
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
