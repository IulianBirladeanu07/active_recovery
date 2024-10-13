import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { useFoodContext } from '../../context/FoodContext';

const { width } = Dimensions.get('window');

const AddProductsScreen = () => {
  const route = useRoute();
  const { type } = route.params; // Get the 'type' from route params
  const { addCustomFood } = useFoodContext();

  // Initial state for product data
  const [productData, setProductData] = useState({
    Nume_Produs: '',
    Calorii: '',
    Carbohidrati: '',
    Proteine: '',
    Grasimi: '',
    Fibre: '',
    Grasimi_Saturate: '',
    Sare: '',
    Zaharuri: '',
    quantity: type === 'meals' ? '1' : '', // Default quantity for meals
    unit: type === 'meals' ? null : 'grams', // Default to grams for non-meal products
    barcode: '',
  });

  const [showMore, setShowMore] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle unit change and reset nutrient fields
  const handleUnitChange = (itemValue) => {
    setProductData((prevData) => ({
      ...prevData,
      unit: itemValue,
      Calorii: '',
      Carbohidrati: '',
      Proteine: '',
      Grasimi: '',
      Fibre: '',
      Grasimi_Saturate: '',
      Sare: '',
      Zaharuri: '',
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate input
    if (!productData.Nume_Produs) {
      alert('Please enter a product name.');
      return;
    }

    if (type !== 'meals' && productData.Calorii === '') {
      alert('Please enter the calories.');
      return;
    }

    try {
      // Call addCustomFood with product data
      const productId = await addCustomFood(productData);
      alert(`Product added successfully with ID: ${productId}`);

      // Reset form after submission
      setProductData({
        Nume_Produs: '',
        Calorii: '',
        Carbohidrati: '',
        Proteine: '',
        Grasimi: '',
        Fibre: '',
        Grasimi_Saturate: '',
        Sare: '',
        Zaharuri: '',
        quantity: type === 'meals' ? '1' : '',
        unit: type === 'meals' ? null : 'grams',
        barcode: '',
      });
    } catch (error) {
      alert(`Failed to add product: ${error.message}`);
      console.error('Error adding product:', error);
    }
  };

  // Get the placeholder text for nutrients based on the selected unit and type
  const getNutrientPlaceholder = (nutrient) => {
    let unitLabel;
    switch (productData.unit) {
      case 'slices':
        unitLabel = 'slice';
        break;
      case 'pieces':
        unitLabel = 'piece';
        break;
      case 'ml':
        unitLabel = '100 ml';
        break;
      case 'grams':
      default:
        unitLabel = '100 grams';
        break;
    }

    if (['calories'].includes(nutrient) && type !== 'meals' && type !== 'calories') {
      return `${nutrient} (per ${unitLabel})`;
    }

    return `${nutrient}`;
  };

  // Render a reusable input field component
  const renderInputField = (fieldName, keyboardType = 'default') => (
    <TextInput
      style={styles.input}
      placeholder={getNutrientPlaceholder(fieldName)}
      placeholderTextColor="#999"
      value={productData[fieldName]}
      keyboardType={keyboardType}
      onChangeText={(text) => handleInputChange(fieldName, text)}
    />
  );

  // Render product name and calories inputs
  const renderProductNameAndCalories = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        placeholderTextColor="#999"
        value={productData.Nume_Produs}
        onChangeText={(text) => handleInputChange('Nume_Produs', text)}
      />
      {renderInputField('Calorii', 'numeric')}
    </>
  );

  // Render common nutrients input fields
  const renderCommonNutrients = () => (
    <>
      {renderInputField('Carbohidrati', 'numeric')}
      {renderInputField('Proteine', 'numeric')}
      {renderInputField('Grasimi', 'numeric')}
    </>
  );

  // Render additional fields when 'Show More' is toggled
  const renderAdditionalFields = () => (
    <>
      {renderInputField('Fibre', 'numeric')}
      {renderInputField('Grasimi Saturate', 'numeric')}
      {renderInputField('Sare', 'numeric')}
      {renderInputField('Zaharuri', 'numeric')}
    </>
  );

  const renderShowMoreToggle = () => {
    // Only show toggle if the type is not "calories"
    if (type === 'calories') {
      return null; // Do not render the toggle button
    }
  
    return (
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <Text style={styles.showMoreText}>{showMore ? 'Show Less' : 'Show More'}</Text>
      </TouchableOpacity>
    );
  };

  const renderFieldsByType = () => {
    const fields = [];
    switch (type) {
      case 'calories':
        fields.push(
          <View key="calories-section">
            {renderProductNameAndCalories()}
          </View>
        );
        break;
      case 'meals':
        fields.push(
          <View key="meals-section">
            {renderProductNameAndCalories()}
            {renderCommonNutrients()}
          </View>
        );
        break;
      case 'foodWithBarcode':
        fields.push(
          <View key="barcode-section">
            <TextInput
              key="barcode"
              style={styles.input}
              placeholder="Barcode ID"
              placeholderTextColor="#999"
              value={productData.barcode}
              onChangeText={(text) => handleInputChange('barcode', text)}
            />
            {renderProductNameAndCalories()}
            {renderCommonNutrients()}
          </View>
        );
        break;
      case 'foodWithoutBarcode':
        fields.push(
          <View key="foodWithoutBarcode-section">
            {renderProductNameAndCalories()}
            {renderCommonNutrients()}
          </View>
        );
        break;
      default:
        return null;
    }
  
    // Add additional fields if 'showMore' is true
    if (showMore) {
      fields.push(
        <View key="additional-fields">
          {renderAdditionalFields()}
        </View>
      );
    }
  
    return fields;
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
      <Text style={styles.formHeader}>Add Product Details</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderFieldsByType()}
        </ScrollView>
        {renderShowMoreToggle()}
      </View>

      {/* Separate Container for Quantity Input and Submit Button */}
      <View style={styles.quantityContainer}>
        <View style={styles.row}>
          <TextInput
            style={styles.quantityInput}
            placeholder="Quantity"
            placeholderTextColor="#999"
            value={productData.quantity}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('quantity', text)}
          />
          <Picker
            selectedValue={productData.unit}
            style={styles.unitPicker}
            onValueChange={handleUnitChange}
            dropdownIconColor="#FFFFFF"
          >
            <Picker.Item label="grams" value="grams" />
            <Picker.Item label="mls" value="mls" />
            <Picker.Item label="slices" value="slices" />
            <Picker.Item label="pieces" value="pieces" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  formContainer: {
    backgroundColor: '#02202B',
    width: width * 0.9,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 60,
    height: 500,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    marginBottom: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  quantityContainer: {
    width: width * 0.9,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quantityInput: {
    flex: 0.55,
    padding: 12,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  unitPicker: {
    flex: 0.45,
    color: '#FFFFFF',
    marginLeft: 19,
  },
  submitButton: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  showMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AddProductsScreen;
