import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { db, collection, setDoc, getDocs, getDoc, doc, query, where, orderBy, limit, deleteDoc } from '../../../services/firebase';

export const addDocument = async (collectionName, docId, data) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const docRef = doc(collection(db, collectionName), docId);
    await setDoc(docRef, { ...data, uid });
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error.message);
    throw error;
  }
};

export const fetchDocuments = async (collectionName, filters = [], order = null, limitCount = null) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    let q = collection(db, collectionName);
    filters.push(['uid', '==', uid]); // Add uid filter
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

export const fetchDocument = async (collectionName, docId) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const uid = user.uid;

    const docRef = doc(collection(db, collectionName), docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().uid === uid) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error.message);
    throw error;
  }
};

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
    } else {
      throw new Error('Document not found or user not authorized');
    }
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error.message);
    throw error;
  }
};
