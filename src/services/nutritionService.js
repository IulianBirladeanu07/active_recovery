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
    { keywords: ['chicken breast'], image: categoryImageMap.chicken_breast },
    { keywords: ['corn'], image: categoryImageMap.corn },
    { keywords: ['croissant'], image: categoryImageMap.croissant },
    { keywords: ['exercise list'], image: categoryImageMap.exercise_list },
    { keywords: ['food'], image: categoryImageMap.food },
    { keywords: ['french fries'], image: categoryImageMap.french_fries },
    { keywords: ['fried egg'], image: categoryImageMap.fried_egg },
    { keywords: ['fruit'], image: categoryImageMap.fruit },
    { keywords: ['hamburger'], image: categoryImageMap.hamburger },
    { keywords: ['ice cream'], image: categoryImageMap.ice_cream },
    { keywords: ['loaf'], image: categoryImageMap.loaf },
    { keywords: ['mango'], image: categoryImageMap.mango },
    { keywords: ['measurements'], image: categoryImageMap.measurements },
    { keywords: ['meatballs'], image: categoryImageMap.meatballs },
    { keywords: ['milk'], image: categoryImageMap.milk },
    { keywords: ['milkshake'], image: categoryImageMap.milkshake },
    { keywords: ['minced meat'], image: categoryImageMap.minced_meat },
    { keywords: ['muffin'], image: categoryImageMap.muffin },
    // New mappings added below
    { keywords: ['apple juice'], image: categoryImageMap.apple_juice },
    { keywords: ['bagel'], image: categoryImageMap.bagel },
    { keywords: ['barley'], image: categoryImageMap.barley },
    { keywords: ['beetroot'], image: categoryImageMap.beetroot },
    { keywords: ['bell pepper'], image: categoryImageMap.bell_pepper },
    { keywords: ['blackberries'], image: categoryImageMap.blackberries },
    { keywords: ['blackcurrant'], image: categoryImageMap.blackcurrant },
    { keywords: ['bok choy'], image: categoryImageMap.bok_choy },
    { keywords: ['bran flakes'], image: categoryImageMap.bran_flakes },
    { keywords: ['broccoli'], image: categoryImageMap.broccoli },
    { keywords: ['brown bread'], image: categoryImageMap.brown_bread },
    { keywords: ['brussels sprouts'], image: categoryImageMap.brussels_sprouts },
    { keywords: ['butter'], image: categoryImageMap.butter },
    { keywords: ['butternut squash'], image: categoryImageMap.butternut_squash },
    { keywords: ['cabbage'], image: categoryImageMap.cabbage },
    { keywords: ['carrot'], image: categoryImageMap.carrot },
    { keywords: ['cauliflower'], image: categoryImageMap.cauliflower },
    { keywords: ['celery'], image: categoryImageMap.celery },
    { keywords: ['cherries'], image: categoryImageMap.cherries },
    { keywords: ['chicken curry'], image: categoryImageMap.chicken_curry },
    { keywords: ['chicken leg'], image: categoryImageMap.chicken_leg },
    { keywords: ['chickpeas'], image: categoryImageMap.chickpeas },
    { keywords: ['chili pepper'], image: categoryImageMap.chili_pepper },
    { keywords: ['chocolate'], image: categoryImageMap.chocolate },
    { keywords: ['cinnamon roll'], image: categoryImageMap.cinnamon_roll },
    { keywords: ['coconut'], image: categoryImageMap.coconut },
    { keywords: ['coffee'], image: categoryImageMap.coffee },
    { keywords: ['couscous'], image: categoryImageMap.couscous },
    { keywords: ['cranberries'], image: categoryImageMap.cranberries },
    { keywords: ['cucumber'], image: categoryImageMap.cucumber },
    { keywords: ['dates'], image: categoryImageMap.dates },
    { keywords: ['dragonfruit'], image: categoryImageMap.dragonfruit },
    { keywords: ['dumplings'], image: categoryImageMap.dumplings },
    { keywords: ['eggplant'], image: categoryImageMap.eggplant },
    { keywords: ['eggs benedict'], image: categoryImageMap.eggs_benedict },
    { keywords: ['fish fingers'], image: categoryImageMap.fish_fingers },
    { keywords: ['flour'], image: categoryImageMap.flour },
    { keywords: ['garlic'], image: categoryImageMap.garlic },
    { keywords: ['ginger'], image: categoryImageMap.ginger },
    { keywords: ['grapes'], image: categoryImageMap.grapes },
    { keywords: ['green tea'], image: categoryImageMap.green_tea },
    { keywords: ['hazelnuts'], image: categoryImageMap.hazelnuts },
    { keywords: ['honey'], image: categoryImageMap.honey },
    { keywords: ['hot dog'], image: categoryImageMap.hot_dog },
    { keywords: ['hummus'], image: categoryImageMap.hummus },
    { keywords: ['kale'], image: categoryImageMap.kale },
    { keywords: ['kiwi'], image: categoryImageMap.kiwi },
    { keywords: ['lamb'], image: categoryImageMap.lamb },
    { keywords: ['lemon'], image: categoryImageMap.lemon },
    { keywords: ['lentils'], image: categoryImageMap.lentils },
    { keywords: ['lettuce'], image: categoryImageMap.lettuce },
    { keywords: ['lime'], image: categoryImageMap.lime },
    { keywords: ['lychee'], image: categoryImageMap.lychee },
    { keywords: ['macaroni'], image: categoryImageMap.macaroni },
    { keywords: ['mackerel'], image: categoryImageMap.mackerel },
    { keywords: ['mushrooms'], image: categoryImageMap.mushrooms },
    { keywords: ['nectarine'], image: categoryImageMap.nectarine },
    { keywords: ['oats'], image: categoryImageMap.oats },
    { keywords: ['olives'], image: categoryImageMap.olives },
    { keywords: ['onions'], image: categoryImageMap.onions },
    { keywords: ['orange'], image: categoryImageMap.orange },
    { keywords: ['pancakes'], image: categoryImageMap.pancakes },
    { keywords: ['papaya'], image: categoryImageMap.papaya },
    { keywords: ['pasta'], image: categoryImageMap.pasta },
    { keywords: ['peaches'], image: categoryImageMap.peaches },
    { keywords: ['peanuts'], image: categoryImageMap.peanuts },
    { keywords: ['pears'], image: categoryImageMap.pears },
    { keywords: ['peas'], image: categoryImageMap.peas },
    { keywords: ['pineapple'], image: categoryImageMap.pineapple },
    { keywords: ['plums'], image: categoryImageMap.plums },
    { keywords: ['pomegranate'], image: categoryImageMap.pomegranate },
    { keywords: ['potato chips'], image: categoryImageMap.potato_chips },
    { keywords: ['potatoes'], image: categoryImageMap.potatoes },
    { keywords: ['pumpkin'], image: categoryImageMap.pumpkin },
    { keywords: ['quinoa'], image: categoryImageMap.quinoa },
    { keywords: ['radish'], image: categoryImageMap.radish },
    { keywords: ['raspberries'], image: categoryImageMap.raspberries },
    { keywords: ['red cabbage'], image: categoryImageMap.red_cabbage },
    { keywords: ['rhubarb'], image: categoryImageMap.rhubarb },
    { keywords: ['rice'], image: categoryImageMap.rice },
    { keywords: ['salmon'], image: categoryImageMap.salmon },
    { keywords: ['sausages'], image: categoryImageMap.sausages },
    { keywords: ['spinach'], image: categoryImageMap.spinach },
    { keywords: ['strawberries'], image: categoryImageMap.strawberries },
    { keywords: ['sweet corn'], image: categoryImageMap.sweet_corn },
    { keywords: ['sweet potato'], image: categoryImageMap.sweet_potato },
    { keywords: ['tomatoes'], image: categoryImageMap.tomatoes },
    { keywords: ['tuna'], image: categoryImageMap.tuna },
    { keywords: ['turkey'], image: categoryImageMap.turkey },
    { keywords: ['walnuts'], image: categoryImageMap.walnuts },
    { keywords: ['watermelon'], image: categoryImageMap.watermelon },
    { keywords: ['yogurt'], image: categoryImageMap.yogurt },
  ];
    
  for (const { keywords, image } of categoryMappings) {
    const regex = new RegExp(keywords.join('|'), 'i');
    if (regex.test(categoriesList)) {
      return image;
    }
  }

  return categoryImageMap.default; // Default image
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