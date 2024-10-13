import { useState, useEffect } from 'react';

const useValidateProductData = (initialData) => {
  const [errors, setErrors] = useState({});
  const [productData, setProductData] = useState(initialData);

  const validateProductData = () => {
    const newErrors = {};

    // Validate barcode ID - should be only numbers
    if (productData.barcode && !/^\d+$/.test(productData.barcode)) {
      newErrors.barcode = 'Barcode ID must be numeric and contain only digits.';
    }

    // Validate product name - should only allow letters and spaces
    if (productData.Nume_Produs && !/^[A-Za-z\s]+$/.test(productData.Nume_Produs)) {
      newErrors.Nume_Produs = 'Product name can only contain letters and spaces.';
    }

    // Validate other nutrient fields - must be numeric or empty
    const nutrientFields = [
      'Calorii', 'Carbohidrati', 'Proteine', 
      'Grasimi', 'Fibre', 'Grasimi_Saturate', 
      'Sare', 'Zaharuri'
    ];

    nutrientFields.forEach((field) => {
      if (productData[field] && !/^\d*\.?\d*$/.test(productData[field])) {
        newErrors[field] = `${field} must be a valid number.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  useEffect(() => {
    // Validate data when productData changes
    validateProductData();
  }, [productData]);

  return { validateProductData, errors, setProductData, productData };
};

export default useValidateProductData;
