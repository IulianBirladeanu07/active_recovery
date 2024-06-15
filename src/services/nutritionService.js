import { addDocument, fetchDocuments } from '../handlers/NutritionHandler'
import AsyncStorage from '@react-native-async-storage/async-storage';

// USDA API Key
const USDA_API_KEY = 'DEF1MdrT3VgRpaOygDAyNLrq4ccsCpCCI8sJZpnt';

// Fetch foods from USDA API
export const fetchFoodsFromUSDAAPI = async (query) => {
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
    console.error("Failed to fetch foods from USDA API:", err);
    throw err;
  }
};

// Fetch foods from Open Food Facts API by barcode
export const fetchFoodsFromOpenFoodFactsAPI = async (barcode) => {
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

// Get food image based on categories
export const getFoodImage = (categories, categoryImageMap) => {
  if (!categories) return categoryImageMap.default; // Default image if categories are undefined

  const categoriesList = categories.join(', ').toLowerCase();

  const categoryMappings = [
    { keywords: ['almond'], image: categoryImageMap.almond },
    { keywords: ['apple'], image: categoryImageMap.apple },
    { keywords: ['apple juice'], image: categoryImageMap.apple_juice },
    { keywords: ['avocado'], image: categoryImageMap.avocado },
    { keywords: ['bacon'], image: categoryImageMap.bacon },
    { keywords: ['bagel'], image: categoryImageMap.bagel },
    { keywords: ['banana'], image: categoryImageMap.banana },
    { keywords: ['barley'], image: categoryImageMap.barley },
    { keywords: ['beef'], image: categoryImageMap.beef },
    { keywords: ['beetroot'], image: categoryImageMap.beetroot },
    { keywords: ['blueberry'], image: categoryImageMap.blueberry },
    { keywords: ['bread'], image: categoryImageMap.bread },
    { keywords: ['broccoli'], image: categoryImageMap.broccoli },
    { keywords: ['cake'], image: categoryImageMap.cake },
    { keywords: ['candy cane'], image: categoryImageMap.candy_cane },
    { keywords: ['carrot'], image: categoryImageMap.carrot },
    { keywords: ['cereals'], image: categoryImageMap.cereals },
    { keywords: ['cheese'], image: categoryImageMap.cheese },
    { keywords: ['cherries'], image: categoryImageMap.cherries },
    { keywords: ['chicken breast raw'], image: categoryImageMap.chicken_breast_raw },
    { keywords: ['chicken breast'], image: categoryImageMap.chicken_breast },
    { keywords: ['chocolate'], image: categoryImageMap.chocolate },
    { keywords: ['coconut'], image: categoryImageMap.coconut },
    { keywords: ['coffee'], image: categoryImageMap.coffee },
    { keywords: ['corn'], image: categoryImageMap.corn },
    { keywords: ['croissant'], image: categoryImageMap.croissant },
    { keywords: ['eggplant'], image: categoryImageMap.eggplant },
    { keywords: ['eggs'], image: categoryImageMap.eggs },
    { keywords: ['exercise list'], image: categoryImageMap.exercise_list },
    { keywords: ['fish'], image: categoryImageMap.fish },
    { keywords: ['flour'], image: categoryImageMap.flour },
    { keywords: ['food'], image: categoryImageMap.food },
    { keywords: ['french fries'], image: categoryImageMap.french_fries },
    { keywords: ['fried egg'], image: categoryImageMap.fried_egg },
    { keywords: ['fruit'], image: categoryImageMap.fruit },
    { keywords: ['garlic'], image: categoryImageMap.garlic },
    { keywords: ['gingerbread'], image: categoryImageMap.gingerbread },
    { keywords: ['grapes'], image: categoryImageMap.grapes },
    { keywords: ['hamburger'], image: categoryImageMap.hamburger },
    { keywords: ['honey'], image: categoryImageMap.honey },
    { keywords: ['hot dog'], image: categoryImageMap.hot_dog },
    { keywords: ['ice cream'], image: categoryImageMap.ice_cream },
    { keywords: ['kiwi'], image: categoryImageMap.kiwi },
    { keywords: ['lamb'], image: categoryImageMap.lamb },
    { keywords: ['lettuce'], image: categoryImageMap.lettuce },
    { keywords: ['lime'], image: categoryImageMap.lime },
    { keywords: ['loaf'], image: categoryImageMap.loaf },
    { keywords: ['mango'], image: categoryImageMap.mango },
    { keywords: ['measurements'], image: categoryImageMap.measurements },
    { keywords: ['meatballs'], image: categoryImageMap.meatballs },
    { keywords: ['milk'], image: categoryImageMap.milk },
    { keywords: ['milkshake'], image: categoryImageMap.milkshake },
    { keywords: ['minced meat'], image: categoryImageMap.minced_meat },
    { keywords: ['muffin'], image: categoryImageMap.muffin },
    { keywords: ['nuts'], image: categoryImageMap.nuts },
    { keywords: ['oats'], image: categoryImageMap.oats },
    { keywords: ['olives'], image: categoryImageMap.olives },
    { keywords: ['onions'], image: categoryImageMap.onions },
    { keywords: ['orange'], image: categoryImageMap.orange },
    { keywords: ['orange juice'], image: categoryImageMap.orange_juice },
    { keywords: ['pancake'], image: categoryImageMap.pancake },
    { keywords: ['pancakes'], image: categoryImageMap.pancakes },
    { keywords: ['papaya'], image: categoryImageMap.papaya },
    { keywords: ['pasta'], image: categoryImageMap.pasta },
    { keywords: ['peach'], image: categoryImageMap.peach },
    { keywords: ['peanuts'], image: categoryImageMap.peanuts },
    { keywords: ['pears'], image: categoryImageMap.pears },
    { keywords: ['peas'], image: categoryImageMap.peas },
    { keywords: ['pineapple'], image: categoryImageMap.pineapple },
    { keywords: ['pizza'], image: categoryImageMap.pizza },
    { keywords: ['popcorn'], image: categoryImageMap.popcorn },
    { keywords: ['potato'], image: categoryImageMap.potato },
    { keywords: ['potato chips'], image: categoryImageMap.potato_chips },
    { keywords: ['potatoes'], image: categoryImageMap.potatoes },
    { keywords: ['pumpkin'], image: categoryImageMap.pumpkin },
    { keywords: ['quinoa'], image: categoryImageMap.quinoa },
    { keywords: ['radish'], image: categoryImageMap.radish },
    { keywords: ['raspberries'], image: categoryImageMap.raspberries },
    { keywords: ['rhubarb'], image: categoryImageMap.rhubarb },
    { keywords: ['rice'], image: categoryImageMap.rice },
    { keywords: ['salmon'], image: categoryImageMap.salmon },
    { keywords: ['sausages'], image: categoryImageMap.sausages },
    { keywords: ['shrooms'], image: categoryImageMap.shrooms },
    { keywords: ['spinach'], image: categoryImageMap.spinach },
    { keywords: ['steak'], image: categoryImageMap.steak },
    { keywords: ['strawberry'], image: categoryImageMap.strawberry },
    { keywords: ['sushi'], image: categoryImageMap.sushi },
    { keywords: ['sweet corn'], image: categoryImageMap.sweet_corn },
    { keywords: ['sweet potatoes'], image: categoryImageMap.sweet_potatoes },
    { keywords: ['tomatoes'], image: categoryImageMap.tomatoes },
    { keywords: ['tuna'], image: categoryImageMap.tuna },
    { keywords: ['turkey'], image: categoryImageMap.turkey },
    { keywords: ['watermelon'], image: categoryImageMap.watermelon },
    { keywords: ['white bread'], image: categoryImageMap.white_bread },
    { keywords: ['yogurt'], image: categoryImageMap.yogurt },
  ];

  for (const mapping of categoryMappings) {
    if (mapping.keywords.some(keyword => categoriesList.includes(keyword))) {
      return mapping.image;
    }
  }
  
  return categoryImageMap.default;
};

// Fetch recent foods from Firestore and AsyncStorage
export const fetchRecentFoods = async () => {
  try {
    const localRecentFoods = await AsyncStorage.getItem('recentFoods');
    const parsedLocalRecentFoods = localRecentFoods ? JSON.parse(localRecentFoods) : [];

    const recentFoodsData = await fetchDocuments('recentFoods', [], ['timestamp', 'desc'], 5);
    const recentFoodsFromFirestore = recentFoodsData.map(item => item.food);

    const combinedRecentFoods = [...new Set([...parsedLocalRecentFoods, ...recentFoodsFromFirestore])].slice(0, 3);
    await AsyncStorage.setItem('recentFoods', JSON.stringify(combinedRecentFoods));

    return combinedRecentFoods;
  } catch (err) {
    console.error("Failed to fetch recent foods:", err);
    throw err;
  }
};