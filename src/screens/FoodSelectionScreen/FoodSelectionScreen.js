import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, Animated, Alert } from 'react-native';
import { debounce } from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './FoodSelectionScreenStyle';
import { fetchProducts, addDocument } from '../../handlers/NutritionHandler';
import Fuse from 'fuse.js';
import { getFoodImage } from '../../services/foodImageService';
import { LinearGradient } from 'expo-linear-gradient';  // For adding gradients
import { useFoodContext } from '../../context/FoodContext'; // Import the context
import { categoryImageMap } from '../../services/foodImageService';

const FoodItem = React.memo(({ item, onPress, isFirstItem, style }) => {
  const imageSource = getFoodImage(item.Nume_Produs, item.Categorie, categoryImageMap);

  return (
    <TouchableOpacity onPress={() => onPress(item, imageSource)} accessibilityLabel={`Select ${item.Nume_Produs}`}>
      <Animated.View style={[styles.foodItem, isFirstItem && styles.firstFoodItem, style]}>
        <Image 
          source={imageSource} 
          style={styles.foodImage} 
          defaultSource={require('../../assets/almond.png')} 
          resizeMode="contain"
          onError={(error) => console.log('Image load error: ', error.nativeEvent.error)}
        />
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.Nume_Produs || 'Unknown'}</Text>
          <Text style={styles.foodNutrient}>Calories: {item.Calorii ? `${item.Calorii} cals` : 'N/A'}</Text>
          <View style={styles.macroContainer}>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{item.Proteine || 'N/A'}</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{item.Carbohidrati || 'N/A'}</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={styles.macroValue}>{item.Grasimi || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const FoodSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meal } = route.params;
  const { handleAddMeal } = useFoodContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [message, setMessage] = useState('');

  const fuse = useMemo(() => new Fuse(foods, {
    includeScore: true,
    keys: ['Nume_Produs', 'Categorie'],
    threshold: 0.3,
    distance: 200,
    minMatchCharLength: 2,
  }), [foods]);

  useEffect(() => {
    if (route.params?.selectedFood) {
      setSelectedFoods(prev => [...prev, route.params.selectedFood]);
    }
  }, [route.params?.selectedFood]);

  const fetchFoods = useCallback(async (query) => {
    setLoading(true);
    setMessage('');
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
        setFoods(fetchedFoods);
      }
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      setMessage('Failed to fetch foods. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchFoods = useMemo(() => debounce(fetchFoods, 200), [fetchFoods]);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchFoods(searchQuery);
    }
  }, [searchQuery, debouncedFetchFoods]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setMessage('');
  }, []);

  const handleNavigateToFoodDetail = (food, imageSource) => {
    navigation.navigate('FoodDetail', { food, meal, imageSource }); // Pass imageSource explicitly
  };
  
  const handleDone = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert("No Foods Selected", "Please select at least one food item before proceeding.");
      return;
    }
  
    try {
      // Attach the correct image source to each selected food item
      const foodsWithImages = selectedFoods.map(food => ({
        ...food,
        image: getFoodImage(food.Nume_Produs, food.Categorie, categoryImageMap),
      }));
  
      await handleAddMeal(meal, foodsWithImages); // Pass the selected foods with images
      navigation.navigate('Nutrition', { refresh: true });
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error", "Failed to save the meal data. Please try again.");
    }
  };
  
  const renderFoodItem = ({ item, index }) => {
    const scaleValue = new Animated.Value(1);

    if (index === 0) {
      Animated.spring(scaleValue, {
        toValue: 1.05,
        friction: 2,
        useNativeDriver: true,
      }).start();
    }

    return (
      <FoodItem
        item={item}
        onPress={handleNavigateToFoodDetail}
        isFirstItem={index === 0}
        style={{ transform: [{ scale: scaleValue }] }}
      />
    );
  };

  const filteredFoodData = useMemo(() => {
    const results = fuse.search(searchQuery).map(result => result.item);
    return results.length > 0 ? results : foods;
  }, [searchQuery, foods, fuse]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for foods"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
          accessibilityLabel="Food search input"
        />
        <TouchableOpacity onPress={() => {}}>
          <MaterialCommunityIcons name="barcode-scan" size={24} style={styles.barcodeIcon} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {message ? (
        <Text style={styles.infoText}>{message}</Text>
      ) : null}

      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredFoodData}
          renderItem={renderFoodItem}
          keyExtractor={useCallback((item) => item.id.toString(), [])}
          ListEmptyComponent={() => (
            <Text style={styles.infoText}>No foods found.</Text>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>

      <LinearGradient
        colors={['transparent', '#02111B']}
        style={styles.gradient}
      />

      {selectedFoods.length > 0 && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>
            Done ({selectedFoods.length} {selectedFoods.length > 1 ? 'items' : 'item'})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FoodSelectionScreen;