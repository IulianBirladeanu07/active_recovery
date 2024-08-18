import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, getDocs, getDoc, addDoc, query, where, orderBy, limit, doc, deleteDoc } from '../services/firebase';

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

/**
 * Adds or updates a document in the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {object} data - The data to store in the document.
 */
export const addDocument = async (collectionName, data) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    // Clean the data to remove undefined values
    const cleanedData = removeUndefined({ ...data, uid });

    // Reference to the collection
    const collectionRef = collection(db, collectionName);
    
    // Add a new document with an auto-generated ID
    const docRef = await addDoc(collectionRef, cleanedData);

    return { id: docRef.id, ...cleanedData };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error.message);
    throw error;
  }
};

/**
 * Deletes a document from the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document to delete.
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    // Log the docId being passed
    console.log(`Attempting to delete document with ID: ${docId} from collection: ${collectionName}`);

    // Reference to the specific document
    const docRef = doc(collection(db, collectionName), docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Document found: ${docId}, UID in document: ${docSnap.data().uid}`);
      if (docSnap.data().uid === uid) {
        await deleteDoc(docRef);
        console.log(`Document with ID: ${docId} deleted successfully.`);
      } else {
        throw new Error('User not authorized to delete this document.');
      }
    } else {
      throw new Error('Document not found.');
    }
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error.message);
    throw error;
  }
};

/**
 * Fetches documents from a specified collection with optional filters, ordering, and limits.
 * @param {string} collectionName - The name of the collection.
 * @param {array} filters - Optional filters for querying the documents.
 * @param {array} order - Optional ordering for the documents.
 * @returns {array} - Array of documents fetched.
 */
export const fetchDocuments = async (collectionName, filters = [], order = null) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    // Reference to the collection
    let q = collection(db, collectionName);

    // Add uid filter to only get documents belonging to the authenticated user
    const queryConstraints = [where('uid', '==', uid), ...filters.map(filter => where(...filter))];

    // Apply ordering if specified
    if (order) {
      queryConstraints.push(orderBy(...order));
    }

    // Apply all constraints in one query call
    q = query(q, ...queryConstraints);

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error.message);
    throw error;
  }
};

/**
 * Fetches products from the 'products' collection with optional filters, ordering, and limits.
 * @param {array} filters - Optional filters for querying the products.
 * @param {array} order - Optional ordering for the products.
 * @param {number} limitCount - Optional limit for the number of products to fetch.
 * @returns {array} - Array of products fetched.
 */
export const fetchProducts = async (filters = [], order = null, limitCount = null) => {
  try {
    const queryConstraints = filters.map(filter => where(...filter));

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
