import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, setDoc, getDocs, getDoc, doc, query, where, orderBy, limit } from '../../../services/firebase';


// Helper function to add a document to Firestore
export const addDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(collection(db, collectionName), docId);
      await setDoc(docRef, { ...data});
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error.message);
      throw error;
    }
  };
  
  // Helper function to fetch documents from Firestore
  export const fetchDocuments = async (collectionName, filters = [], order = null, limitCount = null) => {
    try {
      let q = collection(db, collectionName);
      filters.forEach(filter => {
        q = query(q, where(...filter));
      });
      if (order) {
        q = query(q, orderBy(...order));
      }
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching documents from ${collectionName}:`, error.message);
      throw error;
    }
  };
  
  // Helper function to fetch a single document from Firestore
  export const fetchDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(collection(db, collectionName), docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error(`Error fetching document from ${collectionName}:`, error.message);
      throw error;
    }
  };