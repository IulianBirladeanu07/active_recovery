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
    console.log("Categorii: ", data)
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

  const categoriesList = categories.join(', ').toLowerCase().split(/[\s,]+/); // Split into individual words

  const categoryMappings = [
    { keywords: ['almond', 'almonds'], image: categoryImageMap.almond },
    { keywords: ['apple', 'apples'], image: categoryImageMap.apple },
    { keywords: ['apple juice'], image: categoryImageMap.apple_juice },
    { keywords: ['avocado', 'avocados'], image: categoryImageMap.avocado },
    { keywords: ['bacon'], image: categoryImageMap.bacon },
    { keywords: ['bagel'], image: categoryImageMap.bagel },
    { keywords: ['banana', 'bananas'], image: categoryImageMap.banana },
    { keywords: ['barley'], image: categoryImageMap.barley },
    { keywords: ['beef'], image: categoryImageMap.beef },
    { keywords: ['beetroot', 'beet'], image: categoryImageMap.beetroot },
    { keywords: ['blueberry', 'blueberries'], image: categoryImageMap.blueberry },
    { keywords: ['bread', 'loaf', 'buns'], image: categoryImageMap.bread },
    { keywords: ['broccoli'], image: categoryImageMap.broccoli },
    { keywords: ['cake'], image: categoryImageMap.cake },
    { keywords: ['candy cane'], image: categoryImageMap.candy_cane },
    { keywords: ['carrot', 'carrots'], image: categoryImageMap.carrot },
    { keywords: ['cereals', 'cereal'], image: categoryImageMap.cereals },
    { keywords: ['cheese'], image: categoryImageMap.cheese },
    { keywords: ['cherry', 'cherries'], image: categoryImageMap.cherries },
    { keywords: ['chicken breast raw'], image: categoryImageMap.chicken_breast_raw },
    { keywords: ['chicken breast'], image: categoryImageMap.chicken_breast },
    { keywords: ['chocolate'], image: categoryImageMap.chocolate },
    { keywords: ['coconut'], image: categoryImageMap.coconut },
    { keywords: ['coffee'], image: categoryImageMap.coffee },
    { keywords: ['corn', 'maize'], image: categoryImageMap.corn },
    { keywords: ['croissant'], image: categoryImageMap.croissant },
    { keywords: ['eggplant', 'aubergine'], image: categoryImageMap.eggplant },
    { keywords: ['egg', 'eggs'], image: categoryImageMap.eggs },
    { keywords: ['fish'], image: categoryImageMap.fish },
    { keywords: ['flour'], image: categoryImageMap.flour },
    { keywords: ['french fries', 'fries'], image: categoryImageMap.french_fries },
    { keywords: ['fried egg'], image: categoryImageMap.fried_egg },
    { keywords: ['fruit'], image: categoryImageMap.fruit },
    { keywords: ['garlic'], image: categoryImageMap.garlic },
    { keywords: ['gingerbread'], image: categoryImageMap.gingerbread },
    { keywords: ['grape', 'grapes'], image: categoryImageMap.grapes },
    { keywords: ['hamburger', 'burger'], image: categoryImageMap.hamburger },
    { keywords: ['honey'], image: categoryImageMap.honey },
    { keywords: ['hot dog', 'sausage'], image: categoryImageMap.hot_dog },
    { keywords: ['ice cream'], image: categoryImageMap.ice_cream },
    { keywords: ['kiwi'], image: categoryImageMap.kiwi },
    { keywords: ['lamb'], image: categoryImageMap.lamb },
    { keywords: ['lettuce'], image: categoryImageMap.lettuce },
    { keywords: ['lime'], image: categoryImageMap.lime },
    { keywords: ['mango', 'mangos', 'mangoes'], image: categoryImageMap.mango },
    { keywords: ['meatball', 'meatballs'], image: categoryImageMap.meatballs },
    { keywords: ['milk'], image: categoryImageMap.milk },
    { keywords: ['milkshake'], image: categoryImageMap.milkshake },
    { keywords: ['minced meat', 'ground meat'], image: categoryImageMap.minced_meat },
    { keywords: ['muffin'], image: categoryImageMap.muffin },
    { keywords: ['nuts'], image: categoryImageMap.nuts },
    { keywords: ['oats'], image: categoryImageMap.oats },
    { keywords: ['olive', 'olives'], image: categoryImageMap.olives },
    { keywords: ['onion', 'onions'], image: categoryImageMap.onions },
    { keywords: ['orange', 'oranges'], image: categoryImageMap.orange },
    { keywords: ['orange juice'], image: categoryImageMap.orange_juice },
    { keywords: ['pancake'], image: categoryImageMap.pancake },
    { keywords: ['pancakes'], image: categoryImageMap.pancakes },
    { keywords: ['papaya'], image: categoryImageMap.papaya },
    { keywords: ['pasta'], image: categoryImageMap.pasta },
    { keywords: ['peach', 'peaches'], image: categoryImageMap.peach },
    { keywords: ['peanut', 'peanuts'], image: categoryImageMap.peanuts },
    { keywords: ['pear', 'pears'], image: categoryImageMap.pears },
    { keywords: ['pea', 'peas'], image: categoryImageMap.peas },
    { keywords: ['pineapple', 'pineapples'], image: categoryImageMap.pineapple },
    { keywords: ['pizza'], image: categoryImageMap.pizza },
    { keywords: ['popcorn'], image: categoryImageMap.popcorn },
    { keywords: ['potato'], image: categoryImageMap.potato },
    { keywords: ['potato chips', 'chips'], image: categoryImageMap.potato_chips },
    { keywords: ['pumpkin'], image: categoryImageMap.pumpkin },
    { keywords: ['quinoa'], image: categoryImageMap.quinoa },
    { keywords: ['radish', 'radishes'], image: categoryImageMap.radish },
    { keywords: ['raspberry', 'raspberries'], image: categoryImageMap.raspberries },
    { keywords: ['rhubarb'], image: categoryImageMap.rhubarb },
    { keywords: ['rice'], image: categoryImageMap.rice },
    { keywords: ['salmon', 'fish'], image: categoryImageMap.salmon },
    { keywords: ['sausage', 'sausages'], image: categoryImageMap.sausages },
    { keywords: ['mushroom', 'shrooms'], image: categoryImageMap.shrooms },
    { keywords: ['spinach'], image: categoryImageMap.spinach },
    { keywords: ['steak'], image: categoryImageMap.steak },
    { keywords: ['strawberry', 'strawberries'], image: categoryImageMap.strawberry },
    { keywords: ['sushi'], image: categoryImageMap.sushi },
    { keywords: ['sweet corn', 'corn'], image: categoryImageMap.sweet_corn },
    { keywords: ['sweet potato', 'sweet potatoes'], image: categoryImageMap.sweet_potatoes },
    { keywords: ['tomato', 'tomatoes'], image: categoryImageMap.tomatoes },
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