import React, { useState } from 'react';
import { View, Text, Button, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import BarcodeScanner from '../../../components/BarcodeScanner/BarcodeScanner';
import { fetchProductDetails } from '../../../services/nutritionService';

const NutritionScreen = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBarcodeRead = async (event) => {
    setLoading(true);
    setError('');
    try {
      const productDetails = await fetchProductDetails(event.data);
      if (productDetails) {
        setProduct(productDetails);
      } else {
        setError('Product not found. Try a different barcode.');
      }
    } catch (err) {
      setError('Failed to fetch product details. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <BarcodeScanner onBarcodeRead={handleBarcodeRead} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        product && (
          <ScrollView style={styles.scrollView}>
            <Text style={styles.productName}>{product.product_name || 'Unknown Product'}</Text>
            <Text>{`Calories: ${product.nutriments?.energy_value || 'N/A'}`}</Text>
            <Text>{`Fat: ${product.nutriments?.fat || 'N/A'}g`}</Text>
            <Text>{`Carbohydrates: ${product.nutriments?.carbohydrates || 'N/A'}g`}</Text>
            <Text>{`Proteins: ${product.nutriments?.proteins || 'N/A'}g`}</Text>
            <Button title="Log this food" onPress={() => console.log('Food logged')} />
          </ScrollView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    padding: 20
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  }
});

export default NutritionScreen;
