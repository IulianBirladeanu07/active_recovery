import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, getDocs, query, where, orderBy, limit, getDoc, doc } from '../services/firebase';

export const fetchRecentMeals = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;
    console.log('here')

    // Fetch most recent 10 meals
    const mealQuery = query(
      collection(db, 'meals'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const mealQuerySnapshot = await getDocs(mealQuery);
    const mealDocs = mealQuerySnapshot.docs;
    console.log(mealDocs)
    // Process each meal document
    const meals = mealDocs.map(docSnapshot => {
      const mealData = { id: docSnapshot.id, ...docSnapshot.data() };

      // Ensure 'foods' is always an array
      const foods = Array.isArray(mealData.foods) ? mealData.foods : [];

      console.log(foods)

      // Summarize the meal
      const totalCalories = foods.reduce((total, food) => total + (food.calories || 0), 0);

      return {
        ...mealData,
        foods, // Include food details
        totalCalories // Include total calories
      };
    });

    return meals;
  } catch (error) {
    console.error("Error fetching recent meals:", error.message);
    throw error;
  }
};

export const fetchFrequentFoods = async (limitCount = 10) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    // Query to fetch meals
    const mealQuery = query(
      collection(db, 'meals'),
      where('uid', '==', uid)
    );

    const querySnapshot = await getDocs(mealQuery);
    const foodUsageCount = {};

    // Aggregate usage counts from each meal document
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const foods = data.foods || [];
      foods.forEach(food => {
        if (!foodUsageCount[food.id]) {
          foodUsageCount[food.id] = { ...food, usageCount: 0 };
        }
        foodUsageCount[food.id].usageCount += (food.usageCount || 0);
      });
    });

    // Convert object to array and sort by usageCount
    const frequentFoods = Object.values(foodUsageCount)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limitCount); // Limit results

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
