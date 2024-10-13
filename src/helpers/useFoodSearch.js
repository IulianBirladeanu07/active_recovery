  import { useState, useCallback, useMemo } from 'react';
  import { debounce } from 'lodash';
  import { fetchProducts } from '../handlers/NutritionHandler'

  export const useFoodSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFoodsBySearch = useCallback(async (query) => {
      if (!query) return;

      setLoading(true);

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
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Failed to fetch foods:", err);
      } finally {
        setLoading(false);
      }
    }, []);

    const debouncedFetchFoodsBySearch = useMemo(() => debounce((query) => {
      fetchFoodsBySearch(query);
    }, 300), [fetchFoodsBySearch]);

    const handleSearch = useCallback((query) => {
      setSearchQuery(query);
      if (query) {
        debouncedFetchFoodsBySearch(query);
      } else {
        setSearchResults([]);
      }
    }, [debouncedFetchFoodsBySearch]);

    return {
      searchQuery,
      setSearchQuery,
      searchResults,
      loading,
      handleSearch
    };
  };