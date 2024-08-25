import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, getDocs, query, where, orderBy, limit } from '../services/firebase';

// Fetch Recent Meals
export const fetchRecentFoods = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const mealQuery = query(
      collection(db, 'meals'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(10) // Fetch most recent 10 meals
    );

    const querySnapshot = await getDocs(mealQuery);
    const meals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return meals;
  } catch (error) {
    console.error("Error fetching recent meals:", error.message);
    throw error;
  }
};


// Fetch Frequent Foods
export const fetchFrequentFoods = async (limitCount = 10) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    // Query to fetch meals and calculate the frequency of each food
    const mealQuery = query(
      collection(db, 'meals'),
      where('uid', '==', uid),
      orderBy('usageCount', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(mealQuery);
    const foodUsageCount = {};

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.foodDetails) {
        const { name, usageCount } = data.foodDetails;

        if (!foodUsageCount[name]) {
          foodUsageCount[name] = { ...data.foodDetails, usageCount: 0 };
        }

        foodUsageCount[name].usageCount += (usageCount || 0);
      }
    });

    // Convert object to array and sort by usageCount
    const frequentFoods = Object.values(foodUsageCount).sort((a, b) => b.usageCount - a.usageCount);
    
    return frequentFoods;
  } catch (error) {
    console.error("Error fetching frequent foods:", error.message);
    throw error;
  }
};

// Fetch Products
export const fetchProducts = async (filters = [], order = null, limitCount = null) => {
  try {
    const queryConstraints = [];
    filters.forEach(filter => {
      queryConstraints.push(where(...filter));
    });

    if (order) {
      queryConstraints.push(orderBy(...order));
    }

    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }

    const q = query(collection(db, 'products'), ...queryConstraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching products:`, error.message);
    throw error;
  }
};

export const fetchUsuallyUsedFoods = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const mealQuery = query(
      collection(db, 'meals'),
      where('uid', '==', uid),
      orderBy('usageCount', 'desc'),
      limit(10) // Adjust limit as needed
    );

    const querySnapshot = await getDocs(mealQuery);
    const foodUsageCount = {};

    querySnapshot.forEach(doc => {
      const data = doc.data();

      // Check if the food details are correctly formatted
      if (data.Nume_Produs) {
        const { Nume_Produs, usageCount = 0 } = data;
        
        // Initialize the food in the usage count object if it doesn't exist
        if (!foodUsageCount[Nume_Produs]) {
          foodUsageCount[Nume_Produs] = { ...data, usageCount: 0 };
        }

        // Accumulate the usage count
        foodUsageCount[Nume_Produs].usageCount += usageCount;
      } else {
        console.warn('Food details not found in document:', data);
      }
    });

    console.log('Food Usage Count:', foodUsageCount);

    // Sort foods by usage count in descending order
    const frequentFoods = Object.values(foodUsageCount).sort((a, b) => b.usageCount - a.usageCount);
    return frequentFoods;
  } catch (error) {
    console.error("Error fetching usually used foods:", error.message);
    throw error;
  }
};
