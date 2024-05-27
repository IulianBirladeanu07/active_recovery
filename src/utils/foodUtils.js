// utils/foodUtils.js
import { debounce } from 'lodash';
import { categoryImageMap } from '../assets/categoryImageMap';

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

export const fetchFoodsFromAPI = async (query, apiKey) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=20&api_key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.foods || [];
  } catch (err) {
    console.error("Failed to fetch foods from API:", err);
    throw err;
  }
};

export const debouncedFetchFoods = debounce(fetchFoodsFromAPI, 300);
