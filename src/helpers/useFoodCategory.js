import { useState, useCallback } from 'react';

const useCategoryFoods = (fetchFrequentFoods, fetchRecentMeals, fetchFavoriteFoods, meal) => {
  const [categoryFoods, setCategoryFoods] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('frequent');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFoodsByCategory = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      if (selectedCategory === 'frequent') {
        const fetchedFoods = await fetchFrequentFoods();
        console.log('gav')
        setCategoryFoods(fetchedFoods);
        setMessage(fetchedFoods.length > 0 ? '' : 'No foods found.');
      } else if (selectedCategory === 'recent') {
        const fetchedMeals = await fetchRecentMeals(meal);
        setRecentMeals(fetchedMeals);
        console.log('recen')
        setMessage(fetchedMeals.length > 0 ? '' : 'No meals found.');
      } else if (selectedCategory === 'favorite') {
        const fetchedFavorites = await fetchFavoriteFoods(meal);
        setFavoriteFoods(fetchedFavorites);
        console.log('fav')
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
  }, [selectedCategory, fetchFrequentFoods, fetchRecentMeals, fetchFavoriteFoods, meal]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setMessage(''); // Reset message
  };

  return {
    categoryFoods,
    recentMeals,
    favoriteFoods,
    selectedCategory,
    setSelectedCategory,
    fetchFoodsByCategory,
    handleCategoryChange,
    loading,
    message,
  };
};

export default useCategoryFoods;
