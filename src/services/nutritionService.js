// nutritionService.js
import axios from 'axios';

export const fetchProductDetails = async (barcode) => {
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    if (response.data.status === 1) {
      return response.data.product;
    } else {
      console.error('Product not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};
