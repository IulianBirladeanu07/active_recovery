import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, getDocs, addDoc, query, where, orderBy, limit, doc, deleteDoc } from '../services/firebase';

// Utility function to recursively remove undefined values from an object
const removeUndefined = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined).filter(item => item !== undefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, removeUndefined(v)])
        .filter(([_, v]) => v !== undefined)
    );
  } else {
    return obj;
  }
};

// Fetch Recently Added Foods
export const fetchRecentFoods = async (queryText) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const foodQuery = query(
      collection(db, 'recentFoods'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(foodQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching recent foods:", error.message);
    throw error;
  }
};

// Fetch Usually Used Foods
// Fetch Usually Used Foods
export const fetchUsuallyUsedFoods = async (queryText) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const foodQuery = query(
      collection(db, 'usuallyUsedFoods'),
      where('uid', '==', uid),
      orderBy('usageCount', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(foodQuery);
    const foods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log('Fetched Usually Used Foods:', foods); // Log the fetched foods
    return foods; // This might be an empty array
  } catch (error) {
    console.error("Error fetching usually used foods:", error.message);
    throw error;
  }
};

// Fetch Liked Foods
export const fetchLikedFoods = async (queryText) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const foodQuery = query(
      collection(db, 'likedFoods'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(foodQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching liked foods:", error.message);
    throw error;
  }
};

// Add or Update a Document
export const addDocument = async (collectionName, data) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;
    const cleanedData = removeUndefined({ ...data, uid });
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, cleanedData);
    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error.message);
    throw error;
  }
};

// Delete a Document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;
    const docRef = doc(collection(db, collectionName), docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().uid === uid) {
      await deleteDoc(docRef);
      console.log(`Document with ID: ${docId} deleted successfully.`);
    } else {
      throw new Error('Document not found or user not authorized.');
    }
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error.message);
    throw error;
  }
};

export const fetchProducts = async (filters = [], order = null, limitCount = null) => {
  try {
    const queryConstraints = [];
    console.log('log')
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

export const fetchFoodsSortedBy = async (sortBy, sortDirection = 'desc', query = '') => {
  try {
    // Reference to your foods collection
    let foodsRef = firestore.collection('foods');
    
    // If there's a search query, filter the results by name or category
    if (query) {
      foodsRef = foodsRef
        .where('Nume_Produs_lower', '>=', query.toLowerCase())
        .where('Nume_Produs_lower', '<=', query.toLowerCase() + '\uf8ff');
    }

    // Apply sorting by the given field and direction
    const foodDocs = await foodsRef
      .orderBy(sortBy, sortDirection)
      .limit(100) // Limit the number of results to avoid fetching too many
      .get();

    // Map through the documents and return the data
    const fetchedFoods = foodDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return fetchedFoods;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw new Error('Unable to fetch foods');
  }
};
